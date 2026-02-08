import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cloudinary } from "@/lib/cloudinary"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])
const RATE_LIMIT_MIN_MS = 5 * 60 * 1000

function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")
  const city = request.headers.get("x-user-city")

  if (!userId || !role || !username || !gameNick) {
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "ld" | "cc" | "user",
    username,
    game_nick: gameNick,
    city: (city || "CGB-N") as "CGB-N" | "CGB-P" | "OKB-M",
  }
}

async function rateLimitAvatarUpload(userId: string) {
  const now = new Date()

  const { data: row, error: fetchError } = await supabase
    .from("user_avatar_upload_limits")
    .select("user_id, last_uploaded_at")
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    const msg = (fetchError as any)?.message || ""
    const code = (fetchError as any)?.code
    const hint = msg.toLowerCase()

    // If rate limit table is missing or RLS denies access, don't block avatar updates.
    if (
      code === "42P01" ||
      hint.includes("does not exist") ||
      hint.includes("relation") ||
      hint.includes("permission") ||
      hint.includes("rls")
    ) {
      return { allowed: true as const }
    }

    throw new Error("Не удалось проверить лимит загрузки")
  }

  if (row?.last_uploaded_at) {
    const last = new Date(row.last_uploaded_at)
    const diff = now.getTime() - last.getTime()
    if (diff < RATE_LIMIT_MIN_MS) {
      const secondsLeft = Math.ceil((RATE_LIMIT_MIN_MS - diff) / 1000)
      const minutes = Math.ceil(secondsLeft / 60)
      return { allowed: false as const, secondsLeft, minutes }
    }
  }

  const { error: upsertError } = await supabase
    .from("user_avatar_upload_limits")
    .upsert(
      {
        user_id: userId,
        last_uploaded_at: now.toISOString(),
      },
      { onConflict: "user_id" }
    )

  if (upsertError) {
    const msg = (upsertError as any)?.message || ""
    const code = (upsertError as any)?.code
    const hint = msg.toLowerCase()

    if (
      code === "42P01" ||
      hint.includes("does not exist") ||
      hint.includes("relation") ||
      hint.includes("permission") ||
      hint.includes("rls")
    ) {
      return { allowed: true as const }
    }

    throw new Error("Не удалось обновить лимит загрузки")
  }

  return { allowed: true as const }
}

function getAvatarFolder() {
  return process.env.CLOUDINARY_FOLDER || "mz/avatars"
}

export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Неверный формат запроса" }, { status: 400 })
    }

    const limit = await rateLimitAvatarUpload(currentUser.id)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Слишком часто. Попробуйте через ${limit.minutes} мин.` },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 5MB)" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Неподдерживаемый формат" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const previous = await supabase
      .from("users")
      .select("avatar_public_id")
      .eq("id", currentUser.id)
      .maybeSingle()

    const folder = getAvatarFolder()
    const publicId = `${folder}/${currentUser.id}`

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          overwrite: true,
          resource_type: "image",
          folder,
          transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
        },
        (error: unknown, result: any) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      stream.end(buffer)
    })

    const now = new Date().toISOString()

    const moderationStatus = currentUser.role === "admin" || currentUser.role === "root" ? "approved" : "pending"

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({
        avatar_url: uploadResult.secure_url,
        avatar_public_id: uploadResult.public_id,
        avatar_uploaded_at: now,
        avatar_moderation_status: moderationStatus,
      })
      .eq("id", currentUser.id)
      .select("id, username, game_nick, role, status, city, created_at, avatar_url, avatar_public_id, avatar_uploaded_at, avatar_moderation_status")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Не удалось сохранить аватар" }, { status: 500 })
    }

    if (!previous.error && previous.data?.avatar_public_id && previous.data.avatar_public_id !== uploadResult.public_id) {
      try {
        await cloudinary.uploader.destroy(previous.data.avatar_public_id, { resource_type: "image" })
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ user: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при загрузке аватара" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)
    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("avatar_public_id")
      .eq("id", currentUser.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Не удалось получить пользователя" }, { status: 500 })
    }

    if (user?.avatar_public_id) {
      await cloudinary.uploader.destroy(user.avatar_public_id, { resource_type: "image" })
    }

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({
        avatar_url: null,
        avatar_public_id: null,
        avatar_uploaded_at: null,
      })
      .eq("id", currentUser.id)
      .select("id, username, game_nick, role, status, city, created_at, avatar_url, avatar_public_id, avatar_uploaded_at")
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Не удалось сбросить аватар" }, { status: 500 })
    }

    return NextResponse.json({ user: updated })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Ошибка при удалении аватара" },
      { status: 500 }
    )
  }
}