const SECTION_TITLES: Record<number, string> = {
  1: "Имя Фамилия",
  2: "Пол",
  3: "Национальность",
  4: "Возраст",
  5: "Дата и место рождения",
  6: "Семья",
  7: "Место текущего проживания",
  8: "Описание внешности",
  9: "Особенности характера",
  10: "Детство",
  11: "Юность и взрослая жизнь",
  12: "Настоящее время",
  13: "Хобби",
}

function normalizeLine(s: string) {
  return s.replace(/\r/g, "").trim()
}

function buildTitleIndex() {
  const entries = Object.entries(SECTION_TITLES).map(([k, v]) => [Number(k), v] as const)
  const aliases: Array<[number, string]> = [
    [1, "имя"],
    [1, "имя фамилия"],
    [2, "пол"],
    [3, "национальность"],
    [4, "возраст"],
    [5, "дата и место рождения"],
    [5, "место рождения"],
    [5, "дата рождения"],
    [6, "семья"],
    [7, "место текущего проживания"],
    [7, "текущее проживание"],
    [7, "проживание"],
    [8, "описание внешности"],
    [8, "внешность"],
    [9, "особенности характера"],
    [9, "характер"],
    [10, "детство"],
    [11, "юность и взрослая жизнь"],
    [11, "юность"],
    [12, "настоящее время"],
    [13, "хобби"],
  ]

  const all = [...entries.map(([n, t]) => [n, t.toLowerCase()] as [number, string]), ...aliases]
  // Longer strings first to avoid matching "имя" before "имя фамилия"
  all.sort((a, b) => b[1].length - a[1].length)
  return all
}

const TITLE_INDEX = buildTitleIndex()

function detectHeader(line: string) {
  const l = line.toLowerCase().trim()
  if (!l) return null
  if (l === "цитата") return null

  // Match "<title>: <rest>" or "<title> - <rest>"
  const m = l.match(/^(.{2,60}?)(\s*[:\-]\s*)(.*)$/)
  if (!m) return null

  const left = m[1].trim()
  const rest = (m[3] || "").trim()

  for (const [n, key] of TITLE_INDEX) {
    if (left === key) return { n, rest }
    if (left.includes(key)) return { n, rest }
  }
  return null
}

export function normalizeBiographyTo13Sections(input: string) {
  const lines = input
    .split("\n")
    .map(normalizeLine)
    .filter((l) => l.length > 0)

  const byNumber = new Map<number, string[]>()

  let current: number | null = null

  for (const line of lines) {
    const m = line.match(/^(\d{1,2})\s*[\.)\-:]\s*(.*)$/)
    if (m) {
      const n = Number(m[1])
      if (n >= 1 && n <= 13) {
        current = n
        const rest = (m[2] || "").trim()
        if (!byNumber.has(n)) byNumber.set(n, [])
        if (rest) byNumber.get(n)!.push(rest)
        continue
      }
    }

    const hdr = detectHeader(line)
    if (hdr && hdr.n >= 1 && hdr.n <= 13) {
      current = hdr.n
      if (!byNumber.has(current)) byNumber.set(current, [])
      if (hdr.rest) byNumber.get(current)!.push(hdr.rest)
      continue
    }

    if (current !== null) {
      if (!byNumber.has(current)) byNumber.set(current, [])
      byNumber.get(current)!.push(line)
    }
  }

  // If no numbering was detected, attempt to split by common title prefixes.
  if (byNumber.size === 0) {
    const lower = input.toLowerCase()
    let hits = 0
    for (let i = 1; i <= 13; i++) {
      const t = SECTION_TITLES[i].toLowerCase()
      if (lower.includes(t)) hits += 1
    }

    if (hits >= 4) {
      // naive split: walk lines and detect title mention
      let cur: number | null = null
      for (const line of lines) {
        const idx = Object.entries(SECTION_TITLES).find(([k, v]) =>
          line.toLowerCase().includes(v.toLowerCase())
        )
        if (idx) {
          cur = Number(idx[0])
          if (!byNumber.has(cur)) byNumber.set(cur, [])
          const cleaned = line.replace(new RegExp(SECTION_TITLES[cur], "i"), "").replace(/^[:\-]\s*/, "").trim()
          if (cleaned) byNumber.get(cur)!.push(cleaned)
        } else if (cur !== null) {
          if (!byNumber.has(cur)) byNumber.set(cur, [])
          byNumber.get(cur)!.push(line)
        }
      }
    }
  }

  const missingSections: number[] = []
  const emptySections: number[] = []

  const normalizedLines: string[] = []
  for (let i = 1; i <= 13; i++) {
    const parts = byNumber.get(i) || []
    if (!byNumber.has(i)) missingSections.push(i)
    const text = parts.join(" ").trim()
    if (byNumber.has(i) && !text) emptySections.push(i)
    normalizedLines.push(`${i}. ${SECTION_TITLES[i]}: ${text || ""}`.trim())
  }

  return {
    normalizedText: normalizedLines.join("\n"),
    missingSections,
    emptySections,
    totalSections: 13,
  }
}

export function getSectionText(normalizedText: string, sectionNumber: number) {
  const re = new RegExp(`^${sectionNumber}\\.\\s+[^:]+:\\s*(.*)$`, "m")
  const m = normalizedText.match(re)
  return (m?.[1] || "").trim()
}
