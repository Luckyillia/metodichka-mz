"use client"

import React, { useMemo, useState } from "react"
import { AuthService } from "@/lib/auth/auth-service"

type Status = "success" | "warning" | "error"

type BiographyValidationResult = {
  valid: boolean
  score: number
  sections?: Array<{
    number: number
    title: string
    ok: boolean
    status: Status
    notes: string
    issues: string[]
  }>
  birthdate: {
    extracted: string | null
    calculatedAge: number | null
    statedAge: number | null
    match: boolean
    difference: number
    issues: string[]
    status: Status
  }
  grammar: {
    errorsCount: number
    errors: Array<{
      section: string
      type: "орфография" | "пунктуация" | "согласование" | "стиль"
      error: string
      original: string
      suggestion: string
      severity: "minor" | "major"
    }>
    status: Status
  }
  perspective: {
    isFirstPerson: boolean
    violations: Array<{
      section: string
      text: string
      issue: string
      suggestion: string
    }>
    status: Status
  }
  structure: {
    allSectionsPresent: boolean
    totalSections: number
    missingSections: number[]
    emptySections: number[]
    status: "success" | "error"
  }
  logic: {
    chronologyIssues: string[]
    ageConsistency: boolean
    educationCareerMatch: boolean
    issues: string[]
    status: Status
  }
  recommendations: string[]
  summary: string
}

const MIN_CHARS = 100
const MAX_CHARS = 10000

function statusBadgeClass(status: Status) {
  switch (status) {
    case "success":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    case "warning":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30"
    case "error":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30"
  }
}

function scoreClass(score: number) {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-amber-400"
  return "text-rose-400"
}

function normalizeErrorMessage(err: unknown) {
  if (typeof err === "string") return err
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message
  }
  return "Ошибка запроса"
}

export default function BiographyValidator() {
  const [text, setText] = useState("")
  const [model, setModel] = useState<"llama-3.3-70b-versatile" | "openai/gpt-oss-120b">(
    "llama-3.3-70b-versatile"
  )
  const [debug, setDebug] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BiographyValidationResult | null>(null)

  const chars = text.length
  const charsOk = chars >= MIN_CHARS && chars <= MAX_CHARS

  const ageMismatch = useMemo(() => {
    const diff = (result as any)?.birthdate?.difference
    return typeof diff === "number" && diff > 0
  }, [result])

  const canSubmit = useMemo(() => {
    return !loading && charsOk
  }, [loading, charsOk])

  async function onValidate() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await AuthService.fetchWithAuth("/api/admin/biography/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ biographyText: text, model, debug }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const msg = data?.error || `Ошибка HTTP: ${res.status}`
        throw new Error(msg)
      }

      setResult(data as BiographyValidationResult)
    } catch (e) {
      setError(normalizeErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  async function onCopy() {
    if (!result) return
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Проверка RP Биографий</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Автоматическая AI-проверка на соответствие требованиям (возраст, 1-е лицо, структура, логика).
            </p>
          </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-foreground">Модель</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              disabled={loading}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (быстро)</option>
              <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (умнее)</option>
            </select>

            <div className="text-xs text-muted-foreground flex items-center">
              Рекомендация: если отчёт “плывёт” — попробуй умную модель.
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id="bio-debug"
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="bio-debug" className="text-sm text-muted-foreground">
            Режим отладки (вернёт нормализованный текст и метаданные)
          </label>
        </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Символов</div>
            <div className={`text-lg font-semibold ${charsOk ? "text-foreground" : "text-rose-400"}`}>{chars}</div>
            <div className="text-xs text-muted-foreground">Мин: {MIN_CHARS} | Макс: {MAX_CHARS}</div>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium text-foreground">Биография для проверки</label>
          <textarea
            className="mt-2 w-full min-h-[220px] rounded-xl border border-border bg-input p-4 text-sm text-foreground placeholder:text-muted-foreground caret-primary outline-none focus:ring-2 focus:ring-primary/40 dark:bg-zinc-900/80 dark:text-zinc-100"
            placeholder="Вставьте биографию (13 пунктов)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_CHARS}
          />
          {!charsOk && (
            <div className="mt-2 text-xs text-rose-400">
              Текст должен быть от {MIN_CHARS} до {MAX_CHARS} символов.
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <button
            onClick={onValidate}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg border border-transparent ${
              canSubmit
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading ? "Проверяем..." : "Проверить биографию"}
          </button>

          <div className="text-xs text-muted-foreground">
            {loading ? "Запрос отправлен в AI. Это может занять 5-15 секунд." : ""}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
            <div className="font-semibold">Ошибка</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm text-muted-foreground">Общая оценка</div>
                <div className={`text-3xl font-bold ${scoreClass(result.score)}`}>{result.score}/10</div>
                <div className="mt-1 text-sm">
                  {result.valid ? (
                    <span className="text-emerald-400 font-semibold">✅ Биография прошла проверку</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">❌ Биография не прошла проверку</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onCopy}
                  className="px-5 py-3 rounded-xl font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-lg"
                >
                  Копировать JSON
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">Модель: {model}</div>

            <div className="mt-4 text-sm text-muted-foreground">{result.summary}</div>
          </div>

          {result.sections?.length ? (
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Проверка по пунктам (1-13)</h3>
                <div className="text-xs text-muted-foreground">Каждый пункт: ✅/⚠️/❌ + замечания</div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sections
                  .slice()
                  .sort((a, b) => a.number - b.number)
                  .map((s) => (
                    <div key={s.number} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-foreground">
                          {s.number}. {s.title}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(s.status)}`}
                        >
                          {s.ok ? "✅" : s.status === "warning" ? "⚠️" : "❌"}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{s.notes}</div>
                      {s.issues?.length ? (
                        <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                          {s.issues.map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-2 text-sm text-emerald-400">Без замечаний.</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          {(result as any)?.debug?.normalizedText ? (
            <details className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                Debug
              </summary>
              <div className="mt-3 text-xs text-muted-foreground">Модель: {(result as any).debug.model}</div>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-foreground/80 bg-background/50 border border-border rounded-xl p-4 overflow-auto">
                {(result as any).debug.normalizedText}
              </pre>
            </details>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              className={`rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-xl ${
                ageMismatch ? "border-orange-500/40 bg-orange-500/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Дата рождения и возраст</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.birthdate.status)}`}>
                  {result.birthdate.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-foreground/90 space-y-1">
                <div>Дата: <span className="font-semibold">{result.birthdate.extracted ?? "—"}</span></div>
                <div>Указанный возраст: <span className="font-semibold">{result.birthdate.statedAge ?? "—"}</span></div>
                <div>Реальный возраст: <span className="font-semibold">{result.birthdate.calculatedAge ?? "—"}</span></div>
                <div>Соответствие: <span className={`font-semibold ${result.birthdate.match ? "text-emerald-400" : "text-rose-400"}`}>{result.birthdate.match ? "✅" : "❌"}</span></div>
              </div>
              {result.birthdate.issues?.length > 0 && (
                <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {result.birthdate.issues.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Повествование (1-е лицо)</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.perspective.status)}`}>
                  {result.perspective.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-foreground/90">
                Формат: {result.perspective.isFirstPerson ? (
                  <span className="font-semibold text-emerald-400">✅ Первое лицо</span>
                ) : (
                  <span className="font-semibold text-rose-400">❌ Есть нарушения</span>
                )}
              </div>
              {result.perspective.violations?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {result.perspective.violations.map((v, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="text-sm font-semibold text-foreground">{v.section}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{v.issue}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Фрагмент: {v.text}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Предложение: {v.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Структура</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.structure.status)}`}>
                  {result.structure.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-foreground/90 space-y-1">
                <div>Всего пунктов: <span className="font-semibold">{result.structure.totalSections}</span></div>
                <div>Все пункты присутствуют: <span className={`font-semibold ${result.structure.allSectionsPresent ? "text-emerald-400" : "text-rose-400"}`}>{result.structure.allSectionsPresent ? "✅" : "❌"}</span></div>
              </div>
              {(result.structure.missingSections?.length > 0 || result.structure.emptySections?.length > 0) && (
                <div className="mt-3 text-sm text-muted-foreground space-y-1">
                  {result.structure.missingSections?.length > 0 && (
                    <div>Отсутствуют: {result.structure.missingSections.join(", ")}</div>
                  )}
                  {result.structure.emptySections?.length > 0 && (
                    <div>Пустые: {result.structure.emptySections.join(", ")}</div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-foreground">Грамматика и орфография</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.grammar.status)}`}>
                  {result.grammar.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-foreground/90">
                Найдено ошибок: <span className="font-semibold">{result.grammar.errorsCount}</span>
              </div>
              {result.grammar.errors?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {result.grammar.errors.slice(0, 10).map((e, idx) => (
                    <div key={idx} className="rounded-xl border border-border bg-background/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-foreground">{e.section}</div>
                        <div className="text-xs text-muted-foreground">{e.type} • {e.severity}</div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{e.error}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Найдено: {e.original}</div>
                      <div className="mt-1 text-xs text-muted-foreground">Исправление: {e.suggestion}</div>
                    </div>
                  ))}
                  {result.grammar.errors.length > 10 && (
                    <div className="text-xs text-muted-foreground">Показано 10 из {result.grammar.errors.length} ошибок.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">Логическая связность</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(result.logic.status)}`}>
                {result.logic.status}
              </span>
            </div>

            <div className="mt-3 text-sm text-foreground/90 space-y-1">
              <div>Возрастная согласованность: <span className={`font-semibold ${result.logic.ageConsistency ? "text-emerald-400" : "text-rose-400"}`}>{result.logic.ageConsistency ? "✅" : "❌"}</span></div>
              <div>Образование ↔ карьера: <span className={`font-semibold ${result.logic.educationCareerMatch ? "text-emerald-400" : "text-rose-400"}`}>{result.logic.educationCareerMatch ? "✅" : "❌"}</span></div>
            </div>

            {(result.logic.chronologyIssues?.length > 0 || result.logic.issues?.length > 0) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.logic.chronologyIssues?.length > 0 && (
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="text-sm font-semibold text-foreground">Хронология</div>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {result.logic.chronologyIssues.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.logic.issues?.length > 0 && (
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <div className="text-sm font-semibold text-foreground">Замечания</div>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {result.logic.issues.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">Рекомендации</h3>
            {result.recommendations?.length ? (
              <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {result.recommendations.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-muted-foreground">Нет рекомендаций.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
