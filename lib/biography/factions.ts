// lib/biography/factions.ts
// Общий модуль (клиент + сервер): список фракций и быстрая эвристическая проверка
// соответствия биографии выбранной фракции. Не использует Node-API, безопасен для клиента.
import { normalizeBiographyTo13Sections, getSectionText } from "./normalize"

export const FACTIONS = ["РЖД", "МЗ", "ГИБДД", "ГУВД"] as const
export type Faction = (typeof FACTIONS)[number]

export const FACTION_DESCRIPTIONS: Record<Faction, string> = {
  "РЖД": "Российские железные дороги (железная дорога, поезда, вокзалы, локомотивы)",
  "МЗ": "Министерство здравоохранения (медицина, больницы, врачи, медперсонал)",
  "ГИБДД": "Государственная инспекция безопасности дорожного движения (дорожный патруль, ДПС)",
  "ГУВД": "Главное управление внутренних дел (полиция, оперативная служба)",
}

export function isFaction(value: unknown): value is Faction {
  return typeof value === "string" && (FACTIONS as readonly string[]).includes(value)
}

// \b в JS не работает с кириллицей, поэтому границы слов задаём через lookaround.
const L = "[а-яёa-z]"
const abbr = (w: string) => new RegExp(`(?<!${L})${w}(?!${L})`, "iu") // целое слово / аббревиатура
const stem = (w: string) => new RegExp(`(?<!${L})${w}`, "iu")          // начало слова (основа)

const PATTERNS: Record<Faction, RegExp[]> = {
  "РЖД": [
    abbr("ржд"),
    stem("железнодорож"),
    stem("железн[а-яё]*\\s+дорог"),
    stem("машинист"),
    stem("локомотив"),
    stem("поезд"),
    stem("вокзал"),
    stem("проводник"),
  ],
  "МЗ": [
    abbr("мз"),
    stem("минздрав"),
    stem("министерств[а-яё]*\\s+здравоохранен"),
    stem("больниц"),
    abbr("окб(?:-м)?"),
    abbr("цгб"),
    stem("врач"),
    stem("медицин"),
    stem("медбрат"),
    stem("медсестр"),
    stem("фельдшер"),
    stem("санитар"),
    stem("скор[а-яё]*\\s+помощ"),
  ],
  "ГИБДД": [
    abbr("гибдд"),
    abbr("гаи"),
    abbr("дпс"),
    stem("автоинспек"),
    stem("дорожно-патрул"),
    stem("дорожн[а-яё]*\\s+патрул"),
  ],
  "ГУВД": [
    abbr("гувд"),
    abbr("овд"),
    stem("оперуполномоч"),
    stem("уголовн[а-яё]*\\s+розыск"),
  ],
}

function findFactions(text: string): Faction[] {
  if (!text) return []
  return FACTIONS.filter((f) => PATTERNS[f].some((re) => re.test(text)))
}

export type FactionCheckResult = {
  selected: Faction
  /** Фракции, упомянутые в пункте 12 (настоящее время) */
  detected: Faction[]
  /** Другие фракции, упомянутые только в пункте 11 (прошлое) */
  mentionedElsewhere: Faction[]
  match: boolean
  status: "success" | "warning" | "error"
  issues: string[]
}

/**
 * Быстрая проверка без AI: смотрим пункты 11 (юность/взрослая жизнь) и 12 (настоящее время).
 * - error:   в п.12 названа только другая фракция
 * - warning: в п.12 несколько фракций / не найдена выбранная; в п.11 упомянута другая фракция
 */
export function checkFactionMatch(biographyText: string, selected: Faction): FactionCheckResult {
  const normalized = normalizeBiographyTo13Sections(biographyText).normalizedText
  const s11 = getSectionText(normalized, 11)
  const s12 = getSectionText(normalized, 12)

  const in12 = findFactions(s12)
  const in11 = findFactions(s11)
  const others12 = in12.filter((f) => f !== selected)
  const others11 = in11.filter((f) => f !== selected && !others12.includes(f))
  const selectedIn12 = in12.includes(selected)

  const issues: string[] = []
  let status: FactionCheckResult["status"] = "success"

  if (!s12) {
    issues.push("Пункт 12 (настоящее время) пуст — невозможно проверить фракцию")
    status = "warning"
  } else if (others12.length > 0 && !selectedIn12) {
    issues.push(`В пункте 12 указана другая фракция (${others12.join(", ")}), а выбрана ${selected}`)
    status = "error"
  } else if (others12.length > 0 && selectedIn12) {
    issues.push(`В пункте 12 одновременно упомянуты ${selected} и ${others12.join(", ")} — уточните, где персонаж служит/поступает`)
    status = "warning"
  } else if (!selectedIn12) {
    issues.push(`В пункте 12 не найдено упоминание фракции ${selected} — укажите, что персонаж поступает или служит именно там`)
    status = "warning"
  }

  if (others11.length > 0) {
    issues.push(`В пункте 11 упомянута служба/работа в другой структуре (${others11.join(", ")}) — убедитесь, что переход в ${selected} логично объяснён`)
    if (status === "success") status = "warning"
  }

  return {
    selected,
    detected: in12,
    mentionedElsewhere: others11,
    match: status !== "error",
    status,
    issues,
  }
}
