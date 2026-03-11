import React from "react"
import { DateInput } from "./DateInput"
import { formatDMY } from "../utils"
import type { ValidatorFormState, TitleCheckResult, FormNameCheckResult, StructureCheckResult } from "../types"
import { MIN_CHARS, MAX_CHARS } from "../utils"
import type { AIModel } from "../types"
import { explainTitleMismatch } from "../utils"

interface ValidatorFormProps {
  form: ValidatorFormState
  chars: number
  charsOk: boolean
  parsedWrittenDate: Date | null
  writtenDateNotFuture: boolean
  titleCheck: TitleCheckResult
  formNameCheck: FormNameCheckResult
  structureCheck: StructureCheckResult
  titleMatchesForm: boolean
  canSubmit: boolean
  loading: boolean
  onUpdate: <K extends keyof ValidatorFormState>(key: K, value: ValidatorFormState[K]) => void
  onValidate: () => void
  onValidateBoth: () => void
}

export const ValidatorForm: React.FC<ValidatorFormProps> = ({
  form,
  chars,
  charsOk,
  parsedWrittenDate,
  writtenDateNotFuture,
  titleCheck,
  formNameCheck,
  structureCheck,
  titleMatchesForm,
  canSubmit,
  loading,
  onUpdate,
  onValidate,
  onValidateBoth,
}) => {
  const mismatchDetails = explainTitleMismatch(titleCheck, formNameCheck)

  return (
    <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Проверка RP Биографий</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Автоматическая AI-проверка на соответствие требованиям (возраст, 1-е лицо, структура, логика).
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-muted-foreground">Символов</div>
          <div className={`text-lg font-semibold ${charsOk ? "text-foreground" : "text-rose-400"}`}>{chars}</div>
          <div className="text-xs text-muted-foreground">Мин: {MIN_CHARS} | Макс: {MAX_CHARS}</div>
        </div>
      </div>

      {/* Title + Date */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Заголовок биографии
            <span className="ml-1 text-xs text-rose-400">(обязательно)</span>
          </label>
          <input
            type="text"
            value={form.biographyTitle}
            onChange={(e) => onUpdate("biographyTitle", e.target.value)}
            disabled={loading}
            placeholder="Биография Имя Фамилия"
            maxLength={200}
            className="mt-2 w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          />
          {!titleCheck.ok && form.biographyTitle.trim().length > 0 && (
            <div className="mt-1 text-xs text-rose-400">{titleCheck.error}</div>
          )}
          {form.biographyTitle.trim().length === 0 && (
            <div className="mt-1 text-xs text-muted-foreground">
              Формат: &quot;Биография Имя Фамилия&quot; (без подчёркиваний).
            </div>
          )}
        </div>

        {/* Written date */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Дата написания биографии
            <span className="ml-1 text-xs text-rose-400">(обязательно)</span>
          </label>
          <div className="mt-2">
            <DateInput
              value={form.writtenDate}
              onChange={(v) => onUpdate("writtenDate", v)}
              disabled={loading}
              placeholder="Укажите дату написания биографии"
            />
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            {form.writtenDate && parsedWrittenDate
              ? `✓ Возраст будет проверен на дату: ${formatDMY(parsedWrittenDate)}`
              : "Укажите дату написания — она обязательна"}
          </div>
          {form.writtenDate !== "" && parsedWrittenDate && !writtenDateNotFuture && (
            <div className="mt-1 text-xs text-rose-400">
              Дата написания не может быть позже сегодняшней даты
            </div>
          )}
        </div>
      </div>

      {/* Model */}
      <div className="mt-5">
        <label className="text-sm font-medium text-foreground">Модель</label>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={form.model}
            onChange={(e) => onUpdate("model", e.target.value as AIModel)}
            disabled={loading}
            className="w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (быстро)</option>
            <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (умнее)</option>
          </select>
          <div className="text-xs text-muted-foreground flex items-center">
            Рекомендация: если отчёт &quot;плывёт&quot; — попробуй умную модель.
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="mt-3 space-y-3">
        {/* Strict */}
        <div className="flex items-center gap-2">
          <input
            id="bio-strict"
            type="checkbox"
            checked={form.strict}
            onChange={(e) => onUpdate("strict", e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="bio-strict" className="text-sm text-muted-foreground">
            Строгий режим (если выключить — мягкий)
          </label>
        </div>

        {/* Debug */}
        <div className="flex items-center gap-2">
          <input
            id="bio-debug"
            type="checkbox"
            checked={form.debug}
            onChange={(e) => onUpdate("debug", e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="bio-debug" className="text-sm text-muted-foreground">
            Режим отладки (вернёт нормализованный текст и метаданные)
          </label>
        </div>

        {/* Custom API key */}
        <div>
          <div className="flex items-center gap-2">
            <input
              id="bio-custom-api"
              type="checkbox"
              checked={form.useCustomApiKey}
              onChange={(e) => onUpdate("useCustomApiKey", e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="bio-custom-api" className="text-sm text-muted-foreground">
              Использовать свой Groq API ключ
            </label>
          </div>
          {form.useCustomApiKey && (
            <input
              type="password"
              value={form.customApiKey}
              onChange={(e) => onUpdate("customApiKey", e.target.value)}
              disabled={loading}
              placeholder="gsk_..."
              className="mt-2 w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              autoComplete="off"
            />
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="mt-5">
        <label className="text-sm font-medium text-foreground">Биография для проверки</label>
        <textarea
          className="mt-2 w-full min-h-[220px] rounded-xl border border-border bg-input p-4 text-sm text-foreground placeholder:text-muted-foreground caret-primary outline-none focus:ring-2 focus:ring-primary/40 dark:bg-zinc-900/80 dark:text-zinc-100"
          placeholder="Вставьте биографию (13 пунктов)..."
          value={form.text}
          onChange={(e) => onUpdate("text", e.target.value)}
          maxLength={MAX_CHARS}
        />

        {/* Inline validation messages */}
        {form.text.trim().length > 0 && !formNameCheck.ok && (
          <div className="mt-2 text-xs text-rose-400">{formNameCheck.error}</div>
        )}
        {form.text.trim().length > 0 && formNameCheck.ok && titleCheck.ok && !titleMatchesForm && (
          <div className="mt-2 text-xs text-rose-400">
            Заголовок не совпадает с полем &quot;Имя Фамилия&quot; в тексте. Должно быть: &quot;Биография{" "}
            {formNameCheck.firstName} {formNameCheck.lastName}&quot;.
            {mismatchDetails ? (
              <div className="mt-1 text-[11px] text-rose-300/90">
                {mismatchDetails}
              </div>
            ) : null}
          </div>
        )}
        {form.text.trim().length > 0 && !structureCheck.ok && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
            <div className="text-xs font-semibold text-rose-200">Форма заполнена не полностью</div>
            {structureCheck.missing.length > 0 && (
              <div className="mt-1 text-xs text-rose-100/90">
                Отсутствуют поля: {structureCheck.missing.join(", ")}
              </div>
            )}
            {structureCheck.empty.length > 0 && (
              <div className="mt-1 text-xs text-rose-100/90">
                Пустые поля: {structureCheck.empty.join(", ")}
              </div>
            )}
          </div>
        )}
        {!charsOk && chars > 0 && (
          <div className="mt-2 text-xs text-rose-400">
            Текст должен быть от {MIN_CHARS} до {MAX_CHARS} символов.
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onValidate}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg border border-transparent ${
              canSubmit
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading ? "Проверяем..." : "Проверить"}
          </button>
          <button
            onClick={onValidateBoth}
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg border border-border ${
              canSubmit
                ? "bg-background text-foreground hover:bg-accent"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {loading ? "Проверяем..." : "Проверить (2 модели)"}
          </button>
        </div>
        {loading && (
          <div className="text-xs text-muted-foreground">
            Запрос отправлен в AI. Это может занять 5-15 секунд.
          </div>
        )}
      </div>
    </div>
  )
}