import React, { useEffect, useMemo, useState } from "react"
import { Filter, Search, X } from "lucide-react"
import { OrderBuilderModal } from './components'
import { medicalOrders, getOrderCategories } from './data'
import type { Order } from './types'
import { CITIES, DEFAULT_SETTINGS, POSITIONS } from "./data/constants"

const ORDER_SETTINGS_STORAGE_KEY = "ss_order_settings_v1"
const SETTINGS_UPDATED_EVENT = "ss_order_settings_updated"

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(ORDER_SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<typeof DEFAULT_SETTINGS>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      headerShowHospitalCity:
        typeof parsed.headerShowHospitalCity === "boolean" ? parsed.headerShowHospitalCity : DEFAULT_SETTINGS.headerShowHospitalCity
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const AnnouncementsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>()
  const [mode, setMode] = useState<"template" | "wizard">("template")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = useMemo(() => {
    return ["all", ...getOrderCategories()]
  }, [])

  const clearSearch = () => setSearchQuery("")

  const listOrders = useMemo(() => {
    let filtered = medicalOrders

    if (selectedCategory !== "all") {
      filtered = filtered.filter((o) => o.category === selectedCategory)
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      filtered = filtered.filter((order) => {
        return (
          order.title.toLowerCase().includes(query) ||
          order.content.toLowerCase().includes(query) ||
          order.tags.some((t) => t.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const [previewSettings, setPreviewSettings] = useState(loadSettings)

  useEffect(() => {
    const onUpdated = () => setPreviewSettings(loadSettings())
    window.addEventListener(SETTINGS_UPDATED_EVENT, onUpdated)
    window.addEventListener("storage", onUpdated)
    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, onUpdated)
      window.removeEventListener("storage", onUpdated)
    }
  }, [])

  const derivedHospital = useMemo(() => {
    const city = CITIES.find((c) => c.label === previewSettings.city || c.value === previewSettings.city)
    return city?.hospital ?? previewSettings.hospital
  }, [previewSettings.city, previewSettings.hospital])

  const derivedHospitalGen = useMemo(() => {
    const city = CITIES.find((c) => c.label === previewSettings.city || c.value === previewSettings.city)
    return city?.hospitalGen ?? derivedHospital
  }, [previewSettings.city, derivedHospital])

  const getPositionTitle = useMemo(() => {
    if (previewSettings.positionCustom.trim()) return previewSettings.positionCustom.trim()
    const position = POSITIONS.find((p) => p.value === previewSettings.position)
    return position ? position.label : previewSettings.position
  }, [previewSettings.position, previewSettings.positionCustom])

  const buildHeaderLine = useMemo(() => {
    if (!previewSettings.headerShowHospitalCity) {
      const customTitle = previewSettings.headerCustomTitle.trim() || getPositionTitle
      return `[${customTitle} | {MY_NAME} ]`
    }

    return `[${getPositionTitle} {HOSPITAL_FULL} города {CITY} | {MY_NAME} ]`
  }, [getPositionTitle, previewSettings.headerCustomTitle, previewSettings.headerShowHospitalCity])

  const replaceVariables = (content: string) => {
    let result = content

    result = result.replace(/^\[[^\]]*\]\s*(\r?\n)?/m, `${buildHeaderLine}\n\n`)
    result = result.replace(/\{HOSPITAL_FULL\}/g, derivedHospitalGen)
    result = result.replace(/\{HOSPITAL\}/g, derivedHospital)
    result = result.replace(/\{CITY\}/g, CITIES.find(c => c.value === previewSettings.city)?.label ?? previewSettings.city)
    result = result.replace(/\{MY_NAME\}/g, previewSettings.myName)
    result = result.replace(/\{UP\}/g, previewSettings.up)
    result = result.replace(/\{P\}/g, previewSettings.p)
    result = result.replace(/\{V\}/g, previewSettings.v)

    return result
  }

  const buildOrderListPreview = (order: Order) => {
    return replaceVariables(
      order.content.trimStart().startsWith("[")
        ? order.content
        : `${buildHeaderLine}\n\n${order.content}`
    )
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join("\n")
  }

  const disciplinaryMasterOrder: Order = useMemo(() => {
    return {
      id: "builder-master-vziskaniya",
      title: "Взыскания (мастер)",
      category: "Взыскания",
      content: "[Шаблон | {MY_NAME} ]\n\nПриказ о выдаче служебного взыскания:\n\n(Заполните данные в мастере, чтобы увидеть текст)",
      tags: ["Мастер", "Взыскания"],
    }
  }, [])

  const dismissalMasterOrder: Order = useMemo(() => {
    return {
      id: "builder-master-uvolnenie",
      title: "Увольнение (мастер)",
      category: "Увольнения",
      content: "[Шаблон | {MY_NAME} ]\n\nПриказ об увольнении:\n\n(Заполните данные в мастере, чтобы увидеть текст)",
      tags: ["Мастер", "Увольнение"],
    }
  }, [])

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order)
    setMode("template")
    setIsModalOpen(true)
  }

  const openDisciplinaryMaster = () => {
    setSelectedOrder(undefined)
    setMode("wizard")
    setIsModalOpen(true)
    window.dispatchEvent(new CustomEvent("ss_order_wizard_set_category", { detail: { category: "Взыскания" } }))
  }

  const openDismissalMaster = () => {
    setSelectedOrder(undefined)
    setMode("wizard")
    setIsModalOpen(true)
    window.dispatchEvent(new CustomEvent("ss_order_wizard_set_category", { detail: { category: "Увольнение" } }))
  }

  const listOrdersWithMasters = useMemo(() => {
    return [disciplinaryMasterOrder, dismissalMasterOrder, ...listOrders]
  }, [disciplinaryMasterOrder, dismissalMasterOrder, listOrders])

  return (
    <>
      <div className="subsection">
        <h3>📋 Шаблоны приказов для Доски Объявлений</h3>

        <div className="note mb-6">
          <p>
            <strong>📌 Примечание:</strong> Используйте поиск для быстрого нахождения нужного приказа. Все шаблоны адаптированы для МЗ.
          </p>
        </div>

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
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Категория:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                type="button"
              >
                {cat === "all" ? "Все" : cat}
              </button>
            ))}
          </div>

          {(searchQuery || selectedCategory !== "all") && (
            <p className="mt-3 text-sm text-muted-foreground">
              Найдено: <strong>{listOrders.length}</strong>
            </p>
          )}
        </div>

        <div className="space-y-4">
          {listOrdersWithMasters.length > 0 ? (
            listOrdersWithMasters.map((order) => (
              <div key={order.id} className="p-4 bg-muted/20 rounded-lg border-2 border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-foreground">{order.title}</h4>
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">{order.category}</span>
                </div>

                <div className="mb-3">
                  <button
                    onClick={() => {
                      if (order.id === "builder-master-vziskaniya") {
                        openDisciplinaryMaster()
                        return
                      }
                      if (order.id === "builder-master-uvolnenie") {
                        openDismissalMaster()
                        return
                      }
                      openOrderModal(order)
                    }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    type="button"
                  >
                    Открыть
                  </button>
                </div>

                <div className="mt-3 p-3 rounded-lg border border-border bg-background/50">
                  <p className="text-xs text-muted-foreground mb-2">Предпросмотр:</p>
                  <pre className="text-xs whitespace-pre-wrap text-foreground">{buildOrderListPreview(order)}</pre>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-muted/20 rounded-lg border-2 border-border text-center">
              <p className="text-muted-foreground">По вашему запросу ничего не найдено</p>
            </div>
          )}
        </div>
      </div>

      <OrderBuilderModal
        isOpen={isModalOpen}
        title={selectedOrder?.title ?? "Создание приказа"}
        mode={mode}
        selectedOrder={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default AnnouncementsSection