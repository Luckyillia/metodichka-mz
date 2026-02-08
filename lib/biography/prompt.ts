export type GroqBiographyModel = "llama-3.3-70b-versatile" | "openai/gpt-oss-120b"

export function buildBiographyValidationPrompt(params: {
  biographyText: string
  currentDateISO: string
}) {
  const { biographyText, currentDateISO } = params

  return [
    {
      role: "system" as const,
      content:
        "Ты — строгий модератор RP-биографий. Твоя задача — проверить биографию по правилам ниже и вернуть ТОЛЬКО валидный JSON без markdown, без комментариев, без лишнего текста.",
    },
    {
      role: "user" as const,
      content: `ТЕКУЩАЯ ДАТА (ISO): ${currentDateISO}

ПРОВЕРЬ RP БИОГРАФИЮ ПО ПРАВИЛАМ.

ВАЖНО ПРО СТРУКТУРУ:
- В исходном тексте нумерации может не быть.
- Ты обязан(а) всё равно найти/выделить смыслом 13 обязательных пунктов (1..13) и отразить это в отчёте.
- Если пункт не найден — отметь его как missing/empty и поставь ошибку.

КРИТИЧЕСКИЕ ПРОВЕРКИ:
1) Дата рождения и возраст:
- Извлеки дату рождения из пункта 5. Формат ДД.ММ.ГГГГ.
- Извлеки указанный возраст из пункта 4 (число).
- Рассчитай точный возраст на основе ТЕКУЩЕЙ ДАТЫ.
  Формула:
  Возраст = Текущий год - Год рождения
  Если день рождения в текущем году ещё не наступил → вычесть 1 год
- Допустимая погрешность: ±1 год (если день рождения не наступил).
- Возраст должен быть реалистичным: 18-80 лет.

2) Первое лицо:
- Пункты 10, 11, 12 ОБЯЗАТЕЛЬНО должны быть от первого лица.
- Если встречается третье лицо ("он", имя персонажа вместо "я" и т.п.) — это критическая ошибка.
 - Правило строгое: любые явные маркеры третьего лица в пунктах 10-12 = status=error.

ОСТАЛЬНЫЕ ПРОВЕРКИ:
3) Грамматика и орфография:
- Найди орфографические, пунктуационные, согласование, стиль.
- НЕ считай ошибками названия/топонимы/аббревиатуры игрового мира (Мирный, Приволжск, ОКБ, Невский, ГИБДД, МЗ, ОКБ-М и т.д.).
- В пунктах 10-12 допускаются разговорные обороты, если смысл понятен.

4) Структура:
- Должно быть 13 пунктов, нумерация 1-13.
- Отметь пропуски/пустые пункты.

5) Логика:
- Проверь хронологию (детство→юность→настоящее), возрастную логику (школа, университет, стаж), соответствие образования/карьеры.

ФОРМАТ ОТВЕТА: верни ТОЛЬКО JSON СЛЕДУЮЩЕЙ СТРУКТУРЫ (строго):
{
  "valid": boolean,
  "score": number,
  "sections": Array<{
    "number": number,
    "title": string,
    "ok": boolean,
    "status": "success" | "warning" | "error",
    "notes": string,
    "issues": string[]
  }>,
  "birthdate": {
    "extracted": "ДД.ММ.ГГГГ" | null,
    "calculatedAge": number | null,
    "statedAge": number | null,
    "match": boolean,
    "difference": number,
    "issues": string[],
    "status": "success" | "warning" | "error"
  },
  "grammar": {
    "errorsCount": number,
    "errors": Array<{
      "section": string,
      "type": "орфография" | "пунктуация" | "согласование" | "стиль",
      "error": string,
      "original": string,
      "suggestion": string,
      "severity": "minor" | "major"
    }>,
    "status": "success" | "warning" | "error"
  },
  "perspective": {
    "isFirstPerson": boolean,
    "violations": Array<{
      "section": string,
      "text": string,
      "issue": string,
      "suggestion": string
    }>,
    "status": "success" | "warning" | "error"
  },
  "structure": {
    "allSectionsPresent": boolean,
    "totalSections": number,
    "missingSections": number[],
    "emptySections": number[],
    "status": "success" | "error"
  },
  "logic": {
    "chronologyIssues": string[],
    "ageConsistency": boolean,
    "educationCareerMatch": boolean,
    "issues": string[],
    "status": "success" | "warning" | "error"
  },
  "recommendations": string[],
  "summary": string
}

ДОПОЛНИТЕЛЬНОЕ ТРЕБОВАНИЕ ПО РАЗДЕЛАМ:
- Заполни массив sections ровно из 13 элементов для пунктов 1..13.
- Для каждого пункта укажи:
  - ok/status (success/warning/error)
  - notes: 1-2 предложения что в целом с пунктом
  - issues: конкретные проблемы или [] если всё хорошо.
- Для пунктов 10-12 особенно: если не первое лицо — status=error и ok=false.

ПРАВИЛА ОЦЕНКИ:
- 10: идеально.
- 8-9: 1-2 мелких недочёта.
- 6-7: 3-5 ошибок.
- 4-5: серьёзные проблемы.
- 1-3: плохо.
- 0: не соответствует требованиям.

КРИТИЧЕСКИЕ ОШИБКИ (score 0-3):
- Возраст не соответствует дате рождения (разница >2 лет)
- Пункты 10-12 от третьего лица
- Отсутствует >3 пунктов
- Текст не о персонаже

БИОГРАФИЯ ДЛЯ ПРОВЕРКИ:
${biographyText}`,
    },
  ]
}
