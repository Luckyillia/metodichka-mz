"use client"

import { Shield } from "lucide-react"

interface Position {
  tag: string
  name: string
  rank: string
  category: string
  additionalRoles?: string[]
  responsibilities?: string[]
}

const PositionsSection = () => {
  const positions: Position[] = [
    { 
      tag: "ГВ", 
      name: "Главный врач", 
      rank: "10 ранг", 
      category: "Руководящий состав",
      responsibilities: [
        "Следить за работой больницы",
        "Проводить собрания сотрудников ЦГБ",
        "Проводить собеседования",
        "Выезжать на вызовы, лечить пациентов, проводить медицинские осмотры на призывах, если это требуется"
      ]
    },
    { 
      tag: "ГЗГВ", 
      name: "Главный Заместитель Главного Врача", 
      rank: "9 ранг", 
      category: "Руководящий состав",
      responsibilities: [
        "Следить за работой отделов ЦГБ в отсутствие главного врача",
        "Может принимать, увольнять, повышать, понижать работников (с согласованием Главного Врача)",
        "Проводить собеседования в больницу",
        "Помогать Главному Врачу",
        "Выезжать на вызовы, лечить пациентов, проводить медицинские осмотры на призывах, если это требуется"
      ]
    },
    { tag: "ЗГВ", name: "Заместитель главного врача по кадровой работе", rank: "9 ранг", category: "Руководящий состав" },
    { tag: "ЗГВ", name: "Заместитель по организационно-методической работе", rank: "9 ранг", category: "Руководящий состав" },
    { tag: "Зав. ВО", name: "Заведующий всеми отделениями", rank: "9 ранг", category: "Руководящий состав" },
    { 
      tag: "Зам.Зав. ВО", 
      name: "Заместитель заведующего всеми отделениями", 
      rank: "8 ранг", 
      category: "Заведующие отделениями",
      responsibilities: [
        "Следить за своим отделением",
        "Выезжать на вызовы и лечить пациентов, проводить медицинские осмотры на призывах, если это требуется",
        "Может повышать работников своего отдела",
        "Помогать заместителю главного врача или главному врачу",
        "Помогать на собеседованиях"
      ]
    },
    { tag: "Зав. ОТХ", name: "Заведующий ОТХ", rank: "8 ранг", category: "Заведующие отделениями" },
    { tag: "Зав. ОЛД", name: "Заведующий ОЛД", rank: "8 ранг", category: "Заведующие отделениями" },
    { tag: "Зав. ПМУ", name: "Заведующий ПМУ", rank: "8 ранг", category: "Заведующие отделениями" },
    { 
      tag: "ОТХ", 
      name: "Врач - хирург", 
      rank: "7 ранг", 
      category: "Врачи",
      additionalRoles: [
        "Врач - хирург | Пилот СА",
        "Врач - хирург | Военный врач - хирург ГВ-МУ",
        "Врач - хирург | Инструктор МУ"
      ],
      responsibilities: [
        "Выезжать на вызовы и лечить пациентов, проводить медицинские осмотры на призывах, если это требуется",
        "Проводить любые виды лечения",
        "Проводить медосмотры на призывах",
        "Помогать на собеседованиях",
        "Слушаться своего начальника и должностей старше"
      ]
    },
    { 
      tag: "ОТХ", 
      name: "Врач - терапевт", 
      rank: "6 ранг", 
      category: "Врачи",
      additionalRoles: [
        "Врач - терапевт | Фельдшер СА",
        "Врач - терапевт | Военный врач - терапевт ГВ-МУ"
      ],
      responsibilities: [
        "Находиться в больнице и лечить пациентов",
        "Выезжать на вызовы, патрулирование города, посты АСМП",
        "Проводить любые виды лечения",
        "Помогать на собеседованиях",
        "Проводить медицинские осмотры на призывах",
        "Помогать младшим по должности"
      ]
    },
    { 
      tag: "ОЛД", 
      name: "Врач - участковый", 
      rank: "5 ранг", 
      category: "Младший медперсонал",
      responsibilities: [
        "Находиться в больнице и лечить пациентов",
        "Выезжать на вызовы, патрулирование города, посты АСМП",
        "Проводить операции любой сложности",
        "Проводить медицинские осмотры на призывах",
        "Помогать на собеседованиях",
        "Помогать младшим по должности"
      ]
    },
    { 
      tag: "ОЛД", 
      name: "Врач - стажёр", 
      rank: "4 ранг", 
      category: "Младший медперсонал",
      responsibilities: [
        "Находиться в больнице и лечить пациентов",
        "Выезжать на вызовы, патрулирование города, посты АСМП",
        "Проводить операции легкой степени (ушибы, растяжения, сотрясения)",
        "Помогать младшим по должности",
        "Слушаться и помогать старшим по должности",
        "Проводить медицинские осмотры на призывах"
      ]
    },
    { 
      tag: "ОЛД", 
      name: "Лаборант", 
      rank: "3 ранг", 
      category: "Младший медперсонал",
      responsibilities: [
        "Находиться в больнице и лечить пациентов",
        "Выезжать на вызовы, патрулирование города, посты АСМП",
        "Слушаться и помогать старшим по должности",
        "Помогать младшим по должности, а именно: брать с собой на патрулирование города, посты АСМП"
      ]
    },
    { 
      tag: "ПМУ / ММУ / НМУ", 
      name: "Фельдшер", 
      rank: "2 ранг", 
      category: "Стажёры",
      additionalRoles: [
        "[ПМУ] - Приволжск",
        "[ММУ] - Мирный",
        "[НМУ] - Невский"
      ],
      responsibilities: [
        "Находиться в больнице и лечить пациентов",
        "Выезжать на вызовы/патрули. (Только в качестве напарника)",
        "Лично не брать рабочий транспорт",
        "Слушаться старших по должности"
      ]
    },
    { 
      tag: "ПМУ / ММУ / НМУ", 
      name: "Интерн", 
      rank: "1 ранг", 
      category: "Стажёры",
      additionalRoles: [
        "[ПМУ] - Приволжск",
        "[ММУ] - Мирный",
        "[НМУ] - Невский"
      ],
      responsibilities: [
        "Обязан находится в больнице и лечить пациентов",
        "Не принимать, не выезжать на вызовы (только в качестве напарника (с разрешения старшего состава))",
        "Не проводить операции любых сложностей",
        "Не брать рабочий транспорт"
      ]
    },
  ]

  const categories = [
    "Руководящий состав",
    "Заведующие отделениями", 
    "Врачи",
    "Младший медперсонал",
    "Стажёры",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Должности Министерства Здравоохранения</h2>
          <p className="text-sm text-muted-foreground">Иерархия должностей и рангов МЗ</p>
        </div>
      </div>

      {categories.map((category) => {
        const categoryPositions = positions.filter(p => p.category === category)
        if (categoryPositions.length === 0) return null

        return (
          <div key={category} className="subsection">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
              <span>🏛️</span>
              {category}
            </h3>
            <div className="space-y-3">
              {categoryPositions.map((position, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/70 transition-all"
                >
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-slate-100">{position.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-900/40 text-blue-300 rounded-full text-sm font-medium border border-blue-700/50">
                        [{position.tag}]
                      </span>
                      <span className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-full text-sm font-medium border border-purple-700/50">
                        {position.rank}
                      </span>
                    </div>
                    
                    {/* Дополнительные роли для этой должности */}
                    {position.additionalRoles && position.additionalRoles.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2">
                          {position.category === "Стажёры" ? "Теги по городам:" : "Дополнительные роли:"}
                        </p>
                        <div className="space-y-1">
                          {position.additionalRoles.map((role, roleIndex) => (
                            <div key={roleIndex} className="text-sm text-blue-300 flex items-center gap-2">
                              <span className="text-blue-400">•</span>
                              <span>{role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Обязанности должности */}
                    {position.responsibilities && position.responsibilities.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400 mb-2 font-semibold">📋 Обязанности:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          {position.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="text-sm text-slate-300">
                              {resp}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PositionsSection
