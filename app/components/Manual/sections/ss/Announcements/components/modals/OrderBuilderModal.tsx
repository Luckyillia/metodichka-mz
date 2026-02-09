import React, { useState, useMemo, useCallback, useEffect } from "react"
import type { Order } from '../../types'
import { OrderSettingsForm } from '../OrderSettingsForm'
import { StateFields } from '../StateFields'
import { WizardForm } from '../builders/WizardForm'
import { DisciplinaryForm } from '../builders/DisciplinaryForm'
import { TemplateFieldsForm } from '../builders/TemplateFieldsForm'
import { OrderPreview } from '../OrderPreview'
import { useOrderSettings, useOrderWizard, useOrderBuilder } from '../../hooks'
import { POSITIONS, CITIES } from '../../data'
import { hasStateLine, sanitizeForCopy } from '../../utils'

interface OrderBuilderModalProps {
  isOpen: boolean
  title: string
  mode: "template" | "wizard"
  selectedOrder?: Order
  onClose: () => void
}

export const OrderBuilderModal: React.FC<OrderBuilderModalProps> = ({
  isOpen,
  title,
  mode,
  selectedOrder,
  onClose,
}) => {
  const [extraFieldsByTemplate, setExtraFieldsByTemplate] = useState<Record<string, Record<string, string>>>(() => {
    if (typeof window === "undefined") return {}
    const result: Record<string, Record<string, string>> = {}
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (!k || !k.startsWith("ss_order_template_extra_v1:")) continue
        const raw = localStorage.getItem(k)
        if (!raw) continue
        const parsed = JSON.parse(raw) as Record<string, string>
        if (parsed && typeof parsed === "object") result[k] = parsed
      }
    } catch {
      // ignore
    }
    return result
  })

  const extraFieldsStorageKey = useMemo(() => {
    if (mode !== "template" || !selectedOrder?.id) return ""
    return `ss_order_template_extra_v1:${selectedOrder.id}`
  }, [mode, selectedOrder?.id])

  const extraFields = useMemo(() => {
    if (!extraFieldsStorageKey) return {}
    return extraFieldsByTemplate[extraFieldsStorageKey] ?? {}
  }, [extraFieldsByTemplate, extraFieldsStorageKey])

  const setExtraFields = useCallback(
    (updater: (prev: Record<string, string>) => Record<string, string>) => {
      if (!extraFieldsStorageKey) return
      setExtraFieldsByTemplate((prev) => {
        const current = prev[extraFieldsStorageKey] ?? {}
        return { ...prev, [extraFieldsStorageKey]: updater(current) }
      })
    },
    [extraFieldsStorageKey]
  )

  useEffect(() => {
    if (mode !== "template" || !extraFieldsStorageKey) return
    try {
      localStorage.setItem(extraFieldsStorageKey, JSON.stringify(extraFields))
    } catch {
      // ignore
    }
  }, [mode, extraFieldsStorageKey, extraFields])

  const {
    settings,
    updateSetting,
    derivedHospital,
    buildHeaderLine,
    replaceInContent,
  } = useOrderSettings()

  const {
    wizard,
    updateWizard,
    setWizard,
    disciplinary,
    setDisciplinary,
    addDisciplinaryPerson,
    updateDisciplinaryPerson,
    removeDisciplinaryPerson,
    updateDisciplinaryPenalty,
  } = useOrderWizard()

  const { buildWizardText, buildDisciplinaryText } = useOrderBuilder(settings)

  const onExtraFieldChange = useCallback((key: string, value: string) => {
    if (key === "APPLICATION_URL_LINE") {
      const trimmed = value.trim()
      setExtraFields((p) => ({
        ...p,
        [key]: trimmed ? ` Заявление приложено на государственном портале Министерства Здравоохранения. ${trimmed}` : ""
      }))
      return
    }

    setExtraFields((prev) => ({ ...prev, [key]: value }))
  }, [setExtraFields])

  const applyExtraFields = useCallback(
    (content: string) => {
      const enabled = extraFields["__SHOW_DEPARTMENT__"] === "true"
      const dept = (extraFields["TARGET_DEPARTMENT"] ?? "").trim()
      const departmentLine = enabled && dept ? ` Отдел: ${dept}.` : ""

      let result = content
      for (const [key, value] of Object.entries(extraFields)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
      }
      result = result.replace(/\{TARGET_DEPARTMENT_LINE\}/g, departmentLine)
      return result
    },
    [extraFields]
  )

  const previewText = useMemo(() => {
    if (mode === "wizard") {
      if (wizard.category === "Взыскания") {
        return replaceInContent(buildDisciplinaryText(disciplinary))
      }
      return replaceInContent(buildWizardText(wizard))
    }
    if (!selectedOrder) return ""

    return replaceInContent(applyExtraFields(selectedOrder.content))
  }, [mode, selectedOrder, replaceInContent, buildWizardText, buildDisciplinaryText, wizard, disciplinary, applyExtraFields])

  const showStateLine = useMemo(() => {
    const source = mode === "wizard" ? buildWizardText(wizard) : selectedOrder?.content ?? ""
    return hasStateLine(source)
  }, [mode, selectedOrder, buildWizardText, wizard])

  const copyText = useCallback(async () => {
    const sanitized = sanitizeForCopy(previewText)
    await navigator.clipboard.writeText(sanitized)
  }, [previewText])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[min(1400px,98vw)] h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-2 border-border bg-background shadow-xl">
        <div className="p-4 border-b-2 border-border flex items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground">Настрой шапку/данные и скопируй готовый текст</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyText}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
              type="button"
            >
              Копировать
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
              type="button"
            >
              Закрыть
            </button>
          </div>
        </div>

        <div className="h-[calc(92vh-66px)] overflow-auto p-4">
          <div className="space-y-4">
            <OrderSettingsForm
              settings={settings}
              onSettingChange={updateSetting}
              positions={POSITIONS}
              cities={CITIES}
              derivedHospital={derivedHospital}
              buildHeaderLine={buildHeaderLine}
              replaceInContent={replaceInContent}
            />

            {mode === "wizard" && wizard.category === "Взыскания" && (
              <DisciplinaryForm
                disciplinary={disciplinary}
                onPenaltyChange={updateDisciplinaryPenalty}
                onAddPerson={addDisciplinaryPerson}
                onUpdatePerson={updateDisciplinaryPerson}
                onRemovePerson={removeDisciplinaryPerson}
              />
            )}

            {mode === "wizard" && wizard.category !== "Взыскания" && (
              <WizardForm
                wizard={wizard}
                onUpdate={updateWizard}
                setWizard={setWizard}
              />
            )}

            {mode === "template" && selectedOrder?.builder && (
              <TemplateFieldsForm
                fields={selectedOrder.builder.fields}
                extraFields={extraFields}
                onFieldChange={onExtraFieldChange}
              />
            )}

            {showStateLine && (
              <StateFields settings={settings} onSettingChange={updateSetting} />
            )}

            <OrderPreview text={previewText} />
          </div>
        </div>
      </div>
    </div>
  )
}