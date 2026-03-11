import React from "react"
import type { BiographyValidationResult } from "../types"
import { statusBadgeClass, scoreClass, formatDMY } from "../utils"

interface ValidationResultsProps {
  result: BiographyValidationResult
  model: string
  biographyTitle: string
  writtenDate: string
  parsedWrittenDate: Date | null
  usedDate: string | null
  ageMismatch: boolean
  onCopyJSON: () => void
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({
  result,
  model,
  biographyTitle,
  writtenDate,
  parsedWrittenDate,
  usedDate,
  ageMismatch,
  onCopyJSON,
}) => {
  const isPassed = (result as any)?.primaryVerdict === "passed"
  const compare = (result as any)?.compare

  const safeStatus = (s: any): "success" | "warning" | "error" => {
    if (s === "success" || s === "warning" || s === "error") return s
    return "warning"
  }

  function getFailReason(): string {
    const diff = (result as any)?.birthdate?.difference
    if (typeof diff === "number" && diff > 0) return "Причина: возраст не совпадает с датой рождения"
    if ((result as any)?.perspective?.status === "error")  return "Причина: пункты 10–12 не от 1-го лица"
    if ((result as any)?.structure?.status  === "error")  return "Причина: структура 1–13 заполнена не полностью"
    return "Причина: требуются исправления"
  }

  function getFailBullets(): string[] {
    const items: string[] = []
    const diff = (result as any)?.birthdate?.difference
    if (typeof diff === "number" && diff > 0)              items.push("Возраст не совпадает с датой рождения")
    if ((result as any)?.birthdate?.status   === "error") items.push("Ошибка в дате рождения / возрасте")
    if ((result as any)?.perspective?.status === "error") items.push("Пункты 10–12 должны быть строго от 1-го лица")
    if ((result as any)?.structure?.status   === "error") items.push("Не заполнены обязательные пункты 1–13")
    if ((result as any)?.grammar?.status     === "error") items.push("Критические ошибки грамматики")
    if ((result as any)?.logic?.status       === "error") items.push("Критические логические ошибки")
    if (items.length === 0) items.push("Требуются исправления — проверьте детали ниже")
    return items
  }

  return (
    <div className="mt-6 space-y-4">
      {compare?.fast?.result && compare?.smart?.result ? (
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Сравнение 2 моделей</h3>
            <div className="text-xs text-muted-foreground">fast vs smart</div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold text-foreground">Fast: {compare.fast.model}</div>
              <div className="mt-2 text-sm text-muted-foreground">Score: <span className="font-semibold text-foreground">{compare.fast.result.score}</span></div>
              <div className="mt-1 text-sm text-muted-foreground">Verdict: <span className="font-semibold text-foreground">{(compare.fast.result as any)?.primaryVerdict ?? "—"}</span></div>
              <div className="mt-2 text-xs text-muted-foreground">
                birthdate: <span className="font-semibold text-foreground">{(compare.fast.result as any)?.birthdate?.status ?? "—"}</span>
                {" "}· perspective: <span className="font-semibold text-foreground">{(compare.fast.result as any)?.perspective?.status ?? "—"}</span>
                {" "}· structure: <span className="font-semibold text-foreground">{(compare.fast.result as any)?.structure?.status ?? "—"}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold text-foreground">Smart: {compare.smart.model}</div>
              <div className="mt-2 text-sm text-muted-foreground">Score: <span className="font-semibold text-foreground">{compare.smart.result.score}</span></div>
              <div className="mt-1 text-sm text-muted-foreground">Verdict: <span className="font-semibold text-foreground">{(compare.smart.result as any)?.primaryVerdict ?? "—"}</span></div>
              <div className="mt-2 text-xs text-muted-foreground">
                birthdate: <span className="font-semibold text-foreground">{(compare.smart.result as any)?.birthdate?.status ?? "—"}</span>
                {" "}· perspective: <span className="font-semibold text-foreground">{(compare.smart.result as any)?.perspective?.status ?? "—"}</span>
                {" "}· structure: <span className="font-semibold text-foreground">{(compare.smart.result as any)?.structure?.status ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-100/90">
            {(compare.fast.result.score !== compare.smart.result.score || (compare.fast.result as any)?.primaryVerdict !== (compare.smart.result as any)?.primaryVerdict)
              ? "Модели разошлись по итоговой оценке/вердикту. Смотри ниже детали отчёта (они относятся к выбранному результату вверху)."
              : "Итог совпадает. Если есть различия — они в деталях пунктов/замечаний."}
          </div>
        </div>
      ) : null}

      {/* ── Score card ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            {biographyTitle && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-sm font-medium text-foreground">
                📄 {biographyTitle}
              </div>
            )}
            <div className="text-sm text-muted-foreground">Общая оценка</div>
            <div className={`text-3xl font-bold ${scoreClass(result.score)}`}>{result.score}/10</div>

            <div className="mt-1 text-sm">
              {isPassed ? (
                <span className="text-emerald-400 font-semibold">✅ Биография прошла проверку</span>
              ) : (
                <span className={`${result.score < 5 ? "text-rose-400" : "text-orange-400"} font-semibold`}>
                  {result.score < 5 ? "❌ Отказана" : "⚠️ Первичный вердикт: отказана"}
                </span>
              )}
            </div>

            {!isPassed && (
              <div className="mt-2 inline-flex items-center rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs text-orange-200">
                {getFailReason()}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {usedDate && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground">
                📅 Возраст проверен на:{" "}
                <span className="font-semibold text-foreground">
                  {writtenDate && parsedWrittenDate ? formatDMY(parsedWrittenDate) : "сегодня"}
                </span>
              </div>
            )}
            <button
              onClick={onCopyJSON}
              className="px-5 py-3 rounded-xl font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-lg"
            >
              Копировать JSON
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">Модель: {model}</div>

        {!isPassed ? (
          <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
            <div className="text-sm font-semibold text-orange-200">Коротко что не так</div>
            <ul className="mt-2 space-y-1 text-sm text-orange-100/90">
              {getFailBullets().map((t, i) => (
                <li key={i} className="list-disc ml-5">{t}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">
            Биография прошла проверку без замечаний.
          </div>
        )}
      </div>

      {/* ── Sections 1-13 ──────────────────────────────────────────────────── */}
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
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus(s.status))}`}>
                      {s.ok ? "✅" : s.status === "warning" ? "⚠️" : "❌"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{s.notes}</div>
                  {s.issues?.length ? (
                    <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      {s.issues.map((it, idx) => <li key={idx}>{it}</li>)}
                    </ul>
                  ) : (
                    <div className="mt-2 text-sm text-emerald-400">Без замечаний.</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : null}

      {/* ── Debug ──────────────────────────────────────────────────────────── */}
      {(result as any)?.debug?.normalizedText ? (
        <details className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">Debug</summary>
          <div className="mt-3 text-xs text-muted-foreground">Модель: {(result as any).debug.model}</div>
          <pre className="mt-3 whitespace-pre-wrap text-xs text-foreground/80 bg-background/50 border border-border rounded-xl p-4 overflow-auto">
            {(result as any).debug.normalizedText}
          </pre>
        </details>
      ) : null}

      {/* ── Detail grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Birthdate */}
        <div className={`rounded-2xl border bg-card/50 backdrop-blur p-6 shadow-xl ${ageMismatch ? "border-orange-500/40 bg-orange-500/5" : "border-border"}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Дата рождения и возраст</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus((result as any)?.birthdate?.status))}`}>
              {(result as any)?.birthdate?.status ?? "—"}
            </span>
          </div>
          <div className="mt-3 text-sm text-foreground/90 space-y-1">
            <div>Дата: <span className="font-semibold">{(result as any)?.birthdate?.extracted ?? "—"}</span></div>
            <div>Указанный возраст: <span className="font-semibold">{(result as any)?.birthdate?.statedAge ?? "—"}</span></div>
            <div>
              Рассчитанный возраст
              {writtenDate && parsedWrittenDate && (
                <span className="text-xs text-muted-foreground ml-1">(на {formatDMY(parsedWrittenDate)})</span>
              )}
              : <span className="font-semibold">{(result as any)?.birthdate?.calculatedAge ?? "—"}</span>
            </div>
            <div>
              Соответствие:{" "}
              <span className={`font-semibold ${(result as any)?.birthdate?.match ? "text-emerald-400" : "text-rose-400"}`}>
                {(result as any)?.birthdate?.match ? "✅" : "❌"}
              </span>
            </div>
          </div>
          {(result as any)?.birthdate?.issues?.length > 0 && (
            <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {(result as any).birthdate.issues.map((it: string, idx: number) => <li key={idx}>{it}</li>)}
            </ul>
          )}
        </div>

        {/* Perspective */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Повествование (1-е лицо)</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus((result as any)?.perspective?.status))}`}>
              {(result as any)?.perspective?.status ?? "—"}
            </span>
          </div>
          <div className="mt-3 text-sm text-foreground/90">
            Формат:{" "}
            {(result as any)?.perspective?.isFirstPerson ? (
              <span className="font-semibold text-emerald-400">✅ Первое лицо</span>
            ) : (
              <span className="font-semibold text-rose-400">❌ Есть нарушения</span>
            )}
          </div>
          {(result as any)?.perspective?.violations?.length > 0 && (
            <div className="mt-3 space-y-3">
              {(result as any).perspective.violations.map((v: any, idx: number) => (
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

        {/* Structure */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Структура</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus((result as any)?.structure?.status))}`}>
              {(result as any)?.structure?.status ?? "—"}
            </span>
          </div>
          <div className="mt-3 text-sm text-foreground/90 space-y-1">
            <div>Всего пунктов: <span className="font-semibold">{(result as any)?.structure?.totalSections ?? "—"}</span></div>
            <div>
              Все пункты присутствуют:{" "}
              <span className={`font-semibold ${(result as any)?.structure?.allSectionsPresent ? "text-emerald-400" : "text-rose-400"}`}>
                {(result as any)?.structure?.allSectionsPresent ? "✅" : "❌"}
              </span>
            </div>
          </div>
          {(((result as any)?.structure?.missingSections?.length ?? 0) > 0 || ((result as any)?.structure?.emptySections?.length ?? 0) > 0) && (
            <div className="mt-3 text-sm text-muted-foreground space-y-1">
              {(result as any)?.structure?.missingSections?.length > 0 && (
                <div>Отсутствуют: {(result as any).structure.missingSections.join(", ")}</div>
              )}
              {(result as any)?.structure?.emptySections?.length > 0 && (
                <div>Пустые: {(result as any).structure.emptySections.join(", ")}</div>
              )}
            </div>
          )}
        </div>

        {/* Grammar */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Грамматика и орфография</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus((result as any)?.grammar?.status))}`}>
              {(result as any)?.grammar?.status ?? "—"}
            </span>
          </div>
          <div className="mt-3 text-sm text-foreground/90">
            Найдено ошибок: <span className="font-semibold">{(result as any)?.grammar?.errorsCount ?? "—"}</span>
          </div>
          {(result as any)?.grammar?.errors?.length > 0 && (
            <div className="mt-3 space-y-3">
              {(result as any).grammar.errors.slice(0, 10).map((e: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-border bg-background/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-foreground">{e.section}</div>
                    <div className="text-xs text-muted-foreground">{e.type} · {e.severity}</div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{e.error}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Найдено: {e.original}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Исправление: {e.suggestion}</div>
                </div>
              ))}
              {(result as any).grammar.errors.length > 10 && (
                <div className="text-xs text-muted-foreground">
                  Показано 10 из {(result as any).grammar.errors.length} ошибок.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Logic ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground">Логическая связность</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeClass(safeStatus((result as any)?.logic?.status))}`}>
            {(result as any)?.logic?.status ?? "—"}
          </span>
        </div>
        <div className="mt-3 text-sm text-foreground/90 space-y-1">
          <div>
            Возрастная согласованность:{" "}
            <span className={`font-semibold ${(result as any)?.logic?.ageConsistency ? "text-emerald-400" : "text-rose-400"}`}>
              {(result as any)?.logic?.ageConsistency ? "✅" : "❌"}
            </span>
          </div>
          <div>
            Образование ↔ карьера:{" "}
            <span className={`font-semibold ${(result as any)?.logic?.educationCareerMatch ? "text-emerald-400" : "text-rose-400"}`}>
              {(result as any)?.logic?.educationCareerMatch ? "✅" : "❌"}
            </span>
          </div>
        </div>
        {(((result as any)?.logic?.chronologyIssues?.length ?? 0) > 0 || ((result as any)?.logic?.issues?.length ?? 0) > 0) && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(result as any)?.logic?.chronologyIssues?.length > 0 && (
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="text-sm font-semibold text-foreground">Хронология</div>
                <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {(result as any).logic.chronologyIssues.map((it: string, idx: number) => <li key={idx}>{it}</li>)}
                </ul>
              </div>
            )}
            {(result as any)?.logic?.issues?.length > 0 && (
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="text-sm font-semibold text-foreground">Замечания</div>
                <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {(result as any).logic.issues.map((it: string, idx: number) => <li key={idx}>{it}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Recommendations ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-foreground">Рекомендации</h3>
        {result.recommendations?.length ? (
          <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5 space-y-1">
            {result.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
          </ul>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">Нет рекомендаций.</div>
        )}
      </div>
    </div>
  )
}