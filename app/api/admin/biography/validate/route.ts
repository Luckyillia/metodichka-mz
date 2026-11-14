import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { validateBiographyWithGroq } from "@/lib/biography/groq"
import type { GroqBiographyModel } from "@/lib/biography/prompt"
import { normalizeBiographyTo13Sections } from "@/lib/biography/normalize"
import { isFaction } from "@/lib/biography/factions"

const MIN_CHARS = 100
const MAX_CHARS = 10000
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10

const FAST_MODEL: GroqBiographyModel = "openai/gpt-oss-20b"
const SMART_MODEL: GroqBiographyModel = "openai/gpt-oss-120b"
const ALLOWED_MODELS: GroqBiographyModel[] = [FAST_MODEL, SMART_MODEL]

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "instructor" | "user",
    username,
    game_nick: gameNick,
  }
}

function isAllowedRole(role: string) {
  // В проекте уже используются роли root/admin/ld. В ТЗ: root/administrator.
  // Принимаем admin как administrator, чтобы не ломать текущую RBAC.
  return role === "root" || role === "admin"
}

async function rateLimitValidateBiography(userId: string) {
  const now = new Date()
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS).toISOString()

  const { count, error } = await supabase
    .from("action_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", "biography_validate")
    .gte("created_at", windowStart)

  if (error) {
    const msg = (error as any)?.message || ""
    const hint = msg.toLowerCase()

    // Если нет доступа к action_logs (RLS) — не блокируем работу.
    if (hint.includes("permission") || hint.includes("rls")) {
      return { allowed: true as const }
    }

    throw new Error("Не удалось проверить лимит запросов")
  }

  const effective = typeof count === "number" ? count : 0
  if (effective >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false as const }
  }

  return { allowed: true as const }
}

export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    if (!isAllowedRole(currentUser.role)) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
    }

    const limit = await rateLimitValidateBiography(currentUser.id)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Слишком много проверок. Попробуйте позже." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const biographyText = String(body?.biographyText || "")
    const debug = Boolean(body?.debug)
    const strict = body?.strict === false ? false : true
    const compareBoth = Boolean(body?.compareBoth)
    const apiKeyFromBody = typeof body?.apiKey === "string" ? body.apiKey : null
    const requestedModel = String(body?.model || FAST_MODEL)

    // ── Фракция (обязательна) ─────────────────────────────────────────────
    const faction = isFaction(body?.faction) ? body.faction : undefined
    if (!faction) {
      return NextResponse.json({ error: "Выберите фракцию" }, { status: 400 })
    }

    if (!ALLOWED_MODELS.includes(requestedModel as GroqBiographyModel)) {
      return NextResponse.json(
        { error: "Неподдерживаемая модель", model: requestedModel },
        { status: 400 }
      )
    }

    const model = requestedModel as GroqBiographyModel

    let apiKey: string | undefined = undefined
    if (apiKeyFromBody && apiKeyFromBody.trim().length) {
      const trimmed = apiKeyFromBody.trim()
      if (trimmed.length > 200) {
        return NextResponse.json({ error: "API ключ слишком длинный" }, { status: 400 })
      }
      // Basic shape check (do not enforce too hard)
      if (!/^gsk_[A-Za-z0-9_\-]{10,}$/.test(trimmed)) {
        return NextResponse.json({ error: "Неверный формат API ключа" }, { status: 400 })
      }
      apiKey = trimmed
    }

    if (biographyText.trim().length < MIN_CHARS) {
      return NextResponse.json(
        { error: `Минимум ${MIN_CHARS} символов` },
        { status: 400 }
      )
    }

    if (biographyText.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Максимум ${MAX_CHARS} символов` },
        { status: 400 }
      )
    }

    const writtenDate = typeof body?.writtenDate === "string" ? body.writtenDate : null
    const currentDateISO =
      writtenDate && /^\d{4}-\d{2}-\d{2}$/.test(writtenDate) && !isNaN(new Date(writtenDate).getTime())
        ? writtenDate
        : new Date().toISOString().split("T")[0]

    const normalized = normalizeBiographyTo13Sections(biographyText)

    const callModel = async (m: GroqBiographyModel) => {
      return await validateBiographyWithGroq({
        biographyText: normalized.normalizedText,
        currentDateISO,
        model: m,
        apiKey,
        strict,
        faction,
      })
    }

    let result: any
    let compare: any = undefined

    try {
      if (compareBoth) {
        const [fastRes, smartRes] = await Promise.all([
          callModel(FAST_MODEL),
          callModel(SMART_MODEL),
        ])
        // Store models in a separate object first to avoid circular reference
        compare = {
          fast: { model: FAST_MODEL, result: { ...fastRes } },
          smart: { model: SMART_MODEL, result: { ...smartRes } },
        }
        // Primary result is a shallow copy of fastRes
        result = { ...fastRes }
      } else {
        result = await callModel(model)
      }
    } catch (e: any) {
      const message =
        e?.error?.message ||
        e?.message ||
        "Ошибка Groq API"

      const code = e?.error?.code || e?.code
      const type = e?.error?.type || e?.type

      // Groq invalid_request_error (например, decommissioned model) — это 400
      if (type === "invalid_request_error" || code === "model_decommissioned") {
        return NextResponse.json(
          { error: message, code, type },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: message, code, type },
        { status: 502 }
      )
    }

    try {
      const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
      const user_agent = request.headers.get("user-agent")

      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: "Проверка RP биографии (AI)",
          action_type: "biography_validate",
          target_type: "system",
          details: `faction=${faction}; score=${result?.score}; valid=${result?.valid}`,
          metadata: {
            model,
            faction,
            score: result?.score,
            valid: result?.valid,
            birthdate: result?.birthdate,
            structure: result?.structure,
            perspective: result?.perspective,
            factionCheck: result?.factionCheck,
          },
          ip_address,
          user_agent,
        },
      ])
    } catch {
      // ignore
    }

    // Merge deterministic structure info derived from normalization
    result.structure = {
      ...result.structure,
      totalSections: 13,
      allSectionsPresent: normalized.missingSections.length === 0 && normalized.emptySections.length === 0,
      missingSections: normalized.missingSections,
      emptySections: normalized.emptySections,
      status: normalized.missingSections.length > 0 || normalized.emptySections.length > 0 ? "error" : "success",
    }

    if (compareBoth) {
      result.compare = compare
    }

    if (debug) {
      ;(result as any).debug = {
        model: compareBoth ? "compare" : model,
        faction,
        normalizedText: normalized.normalizedText,
        normalization: {
          missingSections: normalized.missingSections,
          emptySections: normalized.emptySections,
        },
      }
    }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при проверке биографии" },
      { status: 500 }
    )
  }
}
