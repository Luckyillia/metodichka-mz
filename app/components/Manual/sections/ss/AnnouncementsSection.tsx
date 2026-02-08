"use client"

import { useState, useMemo } from "react"
import ExamplePhrase from "../../ExamplePhrase"
import { Search, X, Filter } from "lucide-react"
import { medicalOrders, Order } from "./data/medicalTemplates"

interface OrderSettings {
  position: string
  hospital: string
  city: string
  myName: string
  targetName: string
  up: string
  p: string
  v: string
}

const AnnouncementsSection = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Настройки для персонализации приказов
  const [settings, setSettings] = useState<OrderSettings>({
    position: 'ГВ',
    hospital: 'ОКБ',
    city: 'Мирный',
    myName: '',
    targetName: '',
    up: '0',
    p: '0',
    v: '0'
  })

  const positions = [
    { value: 'ГВ', label: 'Главный Врач' },
    { value: 'ГЗГВ', label: 'Главный Заместитель Главного Врача' },
    { value: 'ЗГВ', label: 'Заместитель Главного Врача' },
    { value: 'Зав.ВО', label: 'Заведующий отделением Всеми Отделениями' },
    { value: 'Зав.ОТХ', label: 'Заведующий отделением Отделения терапии и хирургии' },
    { value: 'Зав.ОЛД', label: 'Заведующий отделением Отделения лабораторной диагностики' },
    { value: 'Зав.ММУ', label: 'Заведующий отделением Мирнинского медицинского университета' },
    { value: 'Зав.ПМУ', label: 'Заведующий отделением Приволжского медицинского университета' },
    { value: 'Зав.НМУ', label: 'Заведующий отделением Невского медицинского университета' }
  ]

  const cities = [
    { value: 'Мирный', label: 'Мирный', hospital: 'ОКБ' },
    { value: 'Приволжск', label: 'Приволжск', hospital: 'ЦГБ' },
    { value: 'Невский', label: 'Невский', hospital: 'ЦГБ' }
  ]

  const onSettingChange = (key: keyof OrderSettings, value: string) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      
      // Автоматическое обновление больницы при смене города
      if (key === 'city') {
        const selectedCity = cities.find(c => c.value === value)
        if (selectedCity) {
          newSettings.hospital = selectedCity.hospital
        }
      }
      
      return newSettings
    })
  }

  // Функция для получения полного названия должности
  const getPositionTitle = () => {
    const position = positions.find(p => p.value === settings.position)
    return position ? position.label : settings.position
  }

  // Функция для получения полного названия больницы
  const getHospitalName = () => {
    return settings.hospital === 'ОКБ' 
      ? 'Областной Клинической Больницы' 
      : 'Центральной Городской Больницы'
  }

  // Функция для замены переменных в тексте приказа
  const replaceVariables = (content: string) => {
    let result = content
    
    // Замена должности и больницы в заголовке
    const positionTitle = getPositionTitle()
    const hospitalName = getHospitalName()
    
    result = result.replace(/\{POSITION\}/g, positionTitle)

    // Замена полного названия больницы
    result = result.replace(/\{HOSPITAL_FULL\}/g, hospitalName)

    result = result.replace(/\{MY_NAME\}/g, settings.myName)
    
    // Замена города
    result = result.replace(/\{CITY\}/g, settings.city)
    
    // Замена тега больницы (ОКБ или ЦГБ)
    result = result.replace(/\{HOSPITAL\}/g, settings.hospital)

    // Замена имени целевого сотрудника, если указано
    if (settings.targetName) {
      // Ищем первое упоминание имени в формате Имя_Фамилия
      result = result.replace(/\b[A-Z][a-z]+_[A-Z][a-z]+\b/, settings.targetName)
    }

    // Замена состояния УП, П, В
    result = result.replace(/\{UP\}/g, settings.up)
    result = result.replace(/\{P\}/g, settings.p)
    result = result.replace(/\{V\}/g, settings.v)

    return result
  }

  // Получаем уникальные категории
  const categories = useMemo(() => {
    const cats = Array.from(new Set(medicalOrders.map((order: Order) => order.category)))
    return ["all", ...cats]
  }, [])

  // Фильтрация приказов
  const filteredOrders = useMemo(() => {
    let filtered = medicalOrders

    // Фильтр по категории
    if (selectedCategory !== "all") {
      filtered = filtered.filter((order: Order) => order.category === selectedCategory)
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((order: Order) =>
        order.title.toLowerCase().includes(query) ||
        order.content.toLowerCase().includes(query) ||
        order.tags.some((tag: string) => tag.toLowerCase().includes(query))
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

        {/* Настройки персонализации */}
        <div className="mb-6 p-5 bg-muted/50 rounded-lg border-2 border-border">
          <h4 className="text-lg font-semibold mb-4 text-foreground">⚙️ Настройки приказов</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Должность:</label>
              <select
                value={settings.position}
                onChange={(e) => onSettingChange('position', e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Город:</label>
              <select
                value={settings.city}
                onChange={(e) => onSettingChange('city', e.target.value)}
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {cities.map(city => (
                  <option key={city.value} value={city.value}>
                    {city.value} ({city.hospital})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Больница:</label>
              <input
                type="text"
                value={settings.hospital}
                readOnly
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Автоматически устанавливается по городу</p>
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium mb-2 text-foreground">Ваше имя:</label>
              <input
                type="text"
                value={settings.myName}
                onChange={(e) => onSettingChange('myName', e.target.value)}
                placeholder="Имя Фамилия"
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-foreground">Имя сотрудника:</label>
              <input
                type="text"
                value={settings.targetName}
                onChange={(e) => onSettingChange('targetName', e.target.value)}
                placeholder="Имя_Фамилия"
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Поля состояния УП, П, В */}
          <div className="mt-4 pt-4 border-t-2 border-border">
            <h5 className="text-sm font-semibold mb-3 text-foreground">📊 Состояние сотрудника:</h5>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">УП (0-5):</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={settings.up}
                  onChange={(e) => {
                    const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                    onSettingChange('up', val.toString())
                  }}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">П (0-5):</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={settings.p}
                  onChange={(e) => {
                    const val = Math.min(5, Math.max(0, parseInt(e.target.value) || 0))
                    onSettingChange('p', val.toString())
                  }}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">В (0-3):</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={settings.v}
                  onChange={(e) => {
                    const val = Math.min(3, Math.max(0, parseInt(e.target.value) || 0))
                    onSettingChange('v', val.toString())
                  }}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
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
              Найдено: <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? "приказ" : filteredOrders.length < 5 ? "приказа" : "приказов"}
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
                <ExamplePhrase text={replaceVariables(order.content)} messageType="multiline" type="ss" />
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
              <p className="text-lg">По запросу &quot;{searchQuery}&quot; ничего не найдено</p>
              <p className="text-sm mt-2">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AnnouncementsSection