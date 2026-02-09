import React from 'react'
import type { WizardForm as WizardFormType } from '../../types'

interface WizardFormProps {
  wizard: WizardFormType
  onUpdate: (updates: Partial<WizardFormType>) => void
  setWizard: (next: (prev: WizardFormType) => WizardFormType) => void
}

export const WizardForm: React.FC<WizardFormProps> = ({
  wizard,
  onUpdate,
  setWizard,
}) => {
  return (
    <div className="p-4 rounded-lg border-2 border-border bg-background/50">
      <h5 className="text-sm font-semibold mb-3 text-foreground">Данные</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Сотрудник:</label>
          <input
            type="text"
            value={wizard.targetName}
            onChange={(e) => onUpdate({ targetName: e.target.value })}
            placeholder="Имя_Фамилия"
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Должность сотрудника:</label>
          <input
            type="text"
            value={wizard.targetPosition}
            onChange={(e) => onUpdate({ targetPosition: e.target.value })}
            placeholder="должность"
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {wizard.category === "Отпуск" && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Дата начала:</label>
            <input
              type="text"
              value={wizard.dateFrom}
              onChange={(e) => onUpdate({ dateFrom: e.target.value })}
              placeholder="ДД.ММ.ГГГГ"
              className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Дата окончания:</label>
            <input
              type="text"
              value={wizard.dateTo}
              onChange={(e) => onUpdate({ dateTo: e.target.value })}
              placeholder="ДД.ММ.ГГГГ"
              className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      )}

      {wizard.category === "Увольнение" && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              id="wizardOchs"
              type="checkbox"
              checked={wizard.isOchs}
              onChange={(e) => onUpdate({ isOchs: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="wizardOchs" className="text-sm text-foreground">
              ОЧС
            </label>
          </div>

          {!wizard.isOchs ? (
            <>
              <label className="block text-sm font-medium mb-2 text-foreground mt-3">Причина (опционально):</label>
              <input
                type="text"
                value={wizard.reason}
                onChange={(e) => onUpdate({ reason: e.target.value })}
                placeholder="например: Собственное желание"
                className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />

              <div className="flex items-center gap-2 mt-3">
                <input
                  id="wizardPenaltyFree"
                  type="checkbox"
                  checked={wizard.isPenaltyFree}
                  onChange={(e) => onUpdate({ isPenaltyFree: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="wizardPenaltyFree" className="text-sm text-foreground">
                  Без неустойки
                </label>
              </div>
            </>
          ) : (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Пункт ОЧС:</label>
                <input
                  type="text"
                  value={wizard.ochsPoint}
                  onChange={(e) => onUpdate({ ochsPoint: e.target.value })}
                  placeholder="0.1.11"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Срок ЧС (дней):</label>
                <input
                  type="number"
                  min="0"
                  value={wizard.blacklistDays}
                  onChange={(e) => {
                    const raw = e.target.value
                    if (raw === "") {
                      onUpdate({ blacklistDays: "" })
                      return
                    }
                    const n = Number.parseInt(raw, 10)
                    const normalized = Number.isFinite(n) ? Math.max(0, n) : 0
                    onUpdate({ blacklistDays: normalized.toString() })
                  }}
                  placeholder="30"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">Описание/причина (в скобках):</label>
                <input
                  type="text"
                  value={wizard.ochsReason}
                  onChange={(e) => onUpdate({ ochsReason: e.target.value })}
                  placeholder="Самолив из оф.бесед"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}