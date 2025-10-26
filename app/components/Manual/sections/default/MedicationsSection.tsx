"use client"

import { useState, useMemo } from "react"
import ExamplePhrase from "../../ExamplePhrase"
import { Search, X } from "lucide-react"

const MedicationsSection = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const medications = [
    { symptom: "Головная боль", medicine: "Миг", gender: "его" },
    { symptom: "Мигрени", medicine: "Амигренин", gender: "его" },
    { symptom: "Судороги, нервный тик", medicine: "Аспаркам", gender: "его" },
    { symptom: "Боль в животе", medicine: "Ношпу", gender: "её" },
    { symptom: "Тошнота", medicine: "Драмина", gender: "его" },
    { symptom: "Изжога", medicine: "Алмагель", gender: "его" },
    { symptom: "Боль в печени", medicine: "Гепабене", gender: "его" },
    { symptom: "Сердечная боль", medicine: "Кардиомагнил", gender: "его" },
    { symptom: "Простуда и жар", medicine: "Терафлю", gender: "его" },
    { symptom: "Кашель", medicine: "Лазолван", gender: "его" },
    { symptom: "Влажный кашель с мокротой", medicine: "Амбробене", gender: "его" },
    { symptom: "Насморк", medicine: "Тизин", gender: "его" },
    { symptom: "Боль в горле - спреи", medicine: "Гексорал", gender: "его" },
    { symptom: "Боли в глазах", medicine: "Визин", gender: "его" },
    { symptom: "Боли в ушах", medicine: "Отинум", gender: "его" },
    { symptom: "Боли в почках", medicine: "Урохол", gender: "его" },
    { symptom: "Мочевой пузырь", medicine: "Цистон", gender: "его" },
    { symptom: "Боли в спине, ногах и суставах - мазь", medicine: "Фастум-гель", gender: "его" },
    { symptom: "Геморрой - Свечи от геморроя", medicine: "Натальсид", gender: "его" },
    { symptom: "Диабет", medicine: "Виктоза", gender: "её" },
    { symptom: "Ушибы и ссадины", medicine: "Долобене", gender: "его" },
    { symptom: "Витамины", medicine: "Витамикс", gender: "его" },
    { symptom: "Повышенное давление", medicine: "Андипал", gender: "его" },
    { symptom: "Пониженное давление", medicine: "Норадреналин", gender: "его" },
    { symptom: "Обезболивающие", medicine: "Парацетамол", gender: "его" },
    { symptom: "Для увеличения потенции", medicine: "Сиалекс", gender: "его" },
    { symptom: "Молочница", medicine: "Нистатин", gender: "его" },
    { symptom: "Понос", medicine: "Лоперамид", gender: "его" },
    { symptom: "Запор", medicine: "Линекс Форте", gender: "его" },
    { symptom: "Бессонница", medicine: "Найтвелл", gender: "его" },
    { symptom: "Приступы Астмы", medicine: "Сальбутамол", gender: "его" },
    { symptom: "Стресс", medicine: "Тенотен", gender: "его" }
  ]

  const specialMedications = [
    {
      symptom: "Аллергия",
      medicines: "Цетрин, Кларитин, Эриус, Зодак, Тавегил, Лоратадин",
      note: "После оказания экстренной помощи необходимо взять анализ"
    },
    {
      symptom: "При потере сознания",
      medicines: "Нашатырный спирт",
      note: "Нашатырем смачивают вату и подносят под нос пострадавшему"
    },
    {
      symptom: "Ожоги",
      medicines: "Бепантен",
      note: "Желательно закрыть ожог антибактериальной повязкой Космопор"
    }
  ]

  // Фильтрация препаратов по поисковому запросу
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return medications

    const query = searchQuery.toLowerCase()
    return medications.filter(item => 
      item.symptom.toLowerCase().includes(query) || 
      item.medicine.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Фильтрация специальных препаратов
  const filteredSpecialMedications = useMemo(() => {
    if (!searchQuery.trim()) return specialMedications

    const query = searchQuery.toLowerCase()
    return specialMedications.filter(item => 
      item.symptom.toLowerCase().includes(query) || 
      item.medicines.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const clearSearch = () => setSearchQuery("")

  return (
    <>
      <div className="subsection">
        <h3>💊 Список препаратов</h3>
        
        <div className="note">
          <p><strong>📌 Стоимость всех препаратов: 500 рублей</strong></p>
        </div>

        {/* Поисковая строка */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по симптомам или названию препарата..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Очистить поиск"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Найдено: {filteredMedications.length + filteredSpecialMedications.length} результатов
            </p>
          )}
        </div>

        {/* Список препаратов */}
        <div className="mt-6 space-y-4">
          {filteredMedications.length > 0 ? (
            filteredMedications.map((item, index) => (
              <div key={index} className="bg-card/50 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all">
                <h4 className="text-lg font-semibold text-foreground mb-2">{item.symptom}</h4>
                <ExamplePhrase text={`say Я выпишу Вам ${item.medicine}, ${item.gender} стоимость 500 рублей, Вы согласны?`} />
              </div>
            ))
          ) : searchQuery ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>По запросу "{searchQuery}" ничего не найдено в основном списке</p>
            </div>
          ) : null}
        </div>

        {/* Специальные случаи */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-foreground mb-4">🔍 Специальные случаи</h4>
          <div className="space-y-4">
            {filteredSpecialMedications.length > 0 ? (
              filteredSpecialMedications.map((item, index) => (
                <div key={index} className="bg-card/50 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-all">
                  <h4 className="text-lg font-semibold text-foreground mb-2">{item.symptom}</h4>
                  <p className="text-muted-foreground mb-2"><strong>Препараты:</strong> {item.medicines}</p>
                  <div className="note mt-2">
                    <strong>📌 Примечание:</strong> {item.note}
                  </div>
                </div>
              ))
            ) : searchQuery ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>По запросу "{searchQuery}" ничего не найдено в специальных случаях</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default MedicationsSection
