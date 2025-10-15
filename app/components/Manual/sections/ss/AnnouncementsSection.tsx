"use client"

import { useState, useMemo } from "react"
import ExamplePhrase from "../../ExamplePhrase"
import { Search, X, Filter } from "lucide-react"

interface Order {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
}

const AnnouncementsSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Массив всех приказов
  const orders: Order[] = [
    // Взыскания
    {
      id: "vziskanie-322",
      title: "Выдача служебного взыскания 3.22 ПСГО",
      category: "Взыскания",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о выдаче служебного взыскания:  

Сотрудник Daniel_Manarskiy, находясь в должности врач-хирург, получает взыскание в виде выговора и несёт ответственность по пункту 3.22 ПСГО (Запрещено нарушать правила "журнала активности").  

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["взыскание", "выговор", "ПСГО", "журнал активности"]
    },
    {
      id: "vziskanie-435",
      title: "Выдача служебного взыскания 4.35 ПСГО (Прогул)",
      category: "Взыскания",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о выдаче служебного взыскания:  

Сотрудник Daniel_Manarskiy, находясь в должности врач-хирург, получает взыскание в виде выговора и несёт ответственность по пункту 4.35  ПСГО (Прогул РД)(по решений ГС за МЗ)

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["взыскание", "выговор", "ПСГО", "прогул"]
    },
    {
      id: "snyatie-vziskaniya",
      title: "Снятие служебного взыскания",
      category: "Взыскания",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о снятии служебного взыскания:  

Сотрудник Daniel_Manarskiy, находясь в должности врач-хирург, считается освобождённым от дисциплинарного взыскания в связи с успешно сданным рапортом. Более не нарушайте.  

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["снятие", "взыскание", "рапорт"]
    },
    // Отпуска
    {
      id: "otpusk",
      title: "Предоставление ежемесячного отпуска",
      category: "Отпуска",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский] 

Приказ о предоставлении ежемесячного отпуска:  

Сотрудник Daniel_Manarskiy, находясь в должности врач-хирург, направляется в ежемесячный отпуск с 07.04.25 по 14.04.25 включительно. Хорошего отдыха!`,
      tags: ["отпуск", "ежемесячный"]
    },
    {
      id: "vozvrat-iz-otpuska",
      title: "Возвращение из отпуска",
      category: "Отпуска",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о возращении из отпуска:

Polter_Jameson - выходит из отпуска.`,
      tags: ["отпуск", "возвращение"]
    },
    // Увольнения
    {
      id: "uvolnenie-psj",
      title: "Увольнение по собственному желанию (с неустойкой)",
      category: "Увольнения",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ об увольнении:  

Сотрудник Ambassador_Bavarskiy уволен из Областной Клинической Больницы города Мирный.
Причина: Собственное желание. Неустойка оплачена.
Должность при увольнении:(Заместителя Главного Врача/Начальника Санитарной Авиации).
Спасибо за проделанную медицинскую работу!  

Состояние: УП - {0/5}; П - (0/5); В - [1/3]`,
      tags: ["увольнение", "собственное желание", "неустойка"]
    },
    {
      id: "uvolnenie-ochs",
      title: "Увольнение по ОЧС 0.1.1 (3/3 выговоров)",
      category: "Увольнения",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский] 

Приказ об увольнении:  

Сотрудник Daniel_Manarskiy находясь в должности (Врач-хирург), покидает Областной Клинической Больницы города Мирный, с занесением в общий чёрный список для дальнейшего исключения возможности трудоустройства в организации сроком на 30 дней за нарушение пункта 0.1.1 ОЧС (3/3 выговоров).  

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["увольнение", "ОЧС", "выговоры", "черный список"]
    },
    // Приём
    {
      id: "priem-intern-open",
      title: "Принятие в МУ на должность Интерна (открытое)",
      category: "Приём",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский] 

Приказ о принятии в Медицинский Университет:  

Daniel_Manarskiy принят в Медицинский Университет ОКБ г. Мирный по результатам открытого собеседования на должность Интерна. Желаем успешного продвижения в работе!  

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["приём", "интерн", "открытое собеседование"]
    },
    {
      id: "priem-ss",
      title: "Принятие в Старший состав",
      category: "Приём",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский] 

Приказ о принятии в Старший состав:  

Daniel_Manarskiy восстанавливается в Старший состав ОКБ г. Мирный по результатам закрытого собеседования на должность Заведующего ОЛД. Готов приступить к обязанностям с новыми силами.  

Состояние: УП - {0/5}; П - (0/5); В - [3/3]`,
      tags: ["приём", "старший состав", "заведующий"]
    },
    // Поощрения
    {
      id: "pooshchrenie",
      title: "Поощрение сотрудника",
      category: "Поощрения",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о поощрении сотрудника:  

Сотруднику Kayton_Romanov, находящемуся в должности  Заведующий ММУ, выплачивается премия в размере 200.000 за качественное выполнение своих обязанностей. Продолжайте в том же духе!
Скрин перевода: https://imgur.com/a/AGfOkap`,
      tags: ["поощрение", "премия"]
    },
    // Повышения
    {
      id: "povyshenie",
      title: "Повышение классификации сотрудника",
      category: "Повышения",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский] 

Приказ о повышении классификации сотрудника:  

Сотрудник Ahmed_Berzloy повышается в классификации с Лаборант до Врач-стажёр в связи с успешной сдачей отчётности. Продолжайте в том же духе!  

Состояние: УП - {0/5}; П - (1/5); В - [0/3]`,
      tags: ["повышение", "классификация", "отчёт"]
    },
    {
      id: "ponizenie",
      title: "Понижение классификации сотрудника",
      category: "Повышения",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о понижении классификации сотрудника:  

Сотрудник Daniel_Manarskiy понижается в классификации с Заместителя Главного Врача до Врача-хирурга согласно пункту 4.2 ПЛ (Потеря доверия).  

Состояние: УП - {0/5}; П - (0/5); В - [0/3]`,
      tags: ["понижение", "классификация", "потеря доверия"]
    },
    // Собрания
    {
      id: "sobranie",
      title: "Собрание всего состава",
      category: "Собрания",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о собрании всего состава:  

10.04.25 в 17:00 по МСК состоится сбор всего состава цель сбора будет обявлена на самом сборе. 
Ответственный за построение: Полтер Сокировский.
Явка сотрудников обязательна! В случае не явке отписать в ЛС по форме: 
 - Ник
 - Причина отсутствия`,
      tags: ["собрание", "построение", "явка обязательна"]
    },
    // Переводы
    {
      id: "perevod-sa",
      title: "Перевод сотрудника в СА",
      category: "Переводы",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о переводе сотрудника:  

На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник Timur Goffman переводится в отдел Санитарной Авиации. Желаем успехов, продуктивной работы и роста в новых обязанностях!  

Состояние: УП - {0/5}; П - (0/5); В - [0/3]`,
      tags: ["перевод", "санитарная авиация", "СА"]
    },
    // ВрИО
    {
      id: "snyatie-vrio",
      title: "Снятие ВрИО срока",
      category: "ВрИО",
      content: `[Главный Врач по Областной Клинической Больницы города Мирный | Полтер Сокировский]

Приказ о снятии ВрИО срока:

Сотрудник Kevin_Evil успешно проходит ВрИО срок и становиться на полноценную должность Заведующий ОЛД.`,
      tags: ["ВрИО", "снятие", "заведующий"]
    }
  ]

  // Получаем уникальные категории
  const categories = useMemo(() => {
    const cats = Array.from(new Set(orders.map(order => order.category)))
    return ["all", ...cats]
  }, [])

  // Фильтрация приказов
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Фильтр по категории
    if (selectedCategory !== "all") {
      filtered = filtered.filter(order => order.category === selectedCategory)
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order.title.toLowerCase().includes(query) ||
        order.content.toLowerCase().includes(query) ||
        order.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const clearSearch = () => setSearchQuery("")

  return (
    <>
      <div className="subsection">
        <h3>📋 Шаблоны приказов для Доски Объявлений</h3>

        <div className="note mb-6">
          <p><strong>📌 Примечание:</strong> Используйте поиск для быстрого нахождения нужного приказа. Все шаблоны адаптированы для МЗ.</p>
        </div>

        {/* Поисковая строка */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по названию, содержимому или тегам..."
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

          {/* Фильтр по категориям */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Категория:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat === "all" ? "Все" : cat}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCategory !== "all") && (
            <p className="mt-3 text-sm text-muted-foreground">
              Найдено: <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? "приказ" : "приказов"}
            </p>
          )}
        </div>

        {/* Список приказов */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card/50 p-5 rounded-lg border-2 border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-foreground">{order.title}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {order.category}
                  </span>
                </div>
                <ExamplePhrase text={order.content} messageType="multiline" type="ss" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">По запросу "{searchQuery}" ничего не найдено</p>
              <p className="text-sm mt-2">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AnnouncementsSection
