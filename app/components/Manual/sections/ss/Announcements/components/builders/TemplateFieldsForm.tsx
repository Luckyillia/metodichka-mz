import React from 'react'
import type { OrderBuilderField } from '../../types'

interface TemplateFieldsFormProps {
  fields: OrderBuilderField[]
  extraFields: Record<string, string>
  onFieldChange: (key: string, value: string) => void
}

export const TemplateFieldsForm: React.FC<TemplateFieldsFormProps> = ({
  fields,
  extraFields,
  onFieldChange,
}) => {
  const hasDepartmentField = fields.some((f) => f.key === "TARGET_DEPARTMENT")
  const showDepartmentField = extraFields["__SHOW_DEPARTMENT__"] === "true"

  const normalizeNumberValue = (value: string): string => {
    if (value.trim() === "") return ""
    const n = Number(value)
    if (!Number.isFinite(n)) return ""
    return String(Math.max(0, Math.floor(n)))
  }

  return (
    <div className="p-4 rounded-lg border-2 border-border bg-background/50">
      <h5 className="text-sm font-semibold mb-3 text-foreground"> Поля шаблона</h5>
      <div className="space-y-3">
        {hasDepartmentField && (
          <div className="flex items-center gap-2">
            <input
              id="toggleDepartmentField"
              type="checkbox"
              checked={showDepartmentField}
              onChange={(e) => onFieldChange("__SHOW_DEPARTMENT__", e.target.checked ? "true" : "false")}
              className="h-4 w-4"
            />
            <label htmlFor="toggleDepartmentField" className="text-sm text-foreground">
              Указать отдел
            </label>
          </div>
        )}

        {fields.map((f) => {
          if (f.key === "TARGET_DEPARTMENT" && !showDepartmentField) return null

          return (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-2 text-foreground">{f.label}:</label>

              {f.type === "textarea" ? (
                <textarea
                  value={extraFields[f.key] ?? ""}
                  onChange={(e) => onFieldChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[110px]"
                />
              ) : (
                <input
                  type={
                    f.type === "number"
                      ? "number"
                      : f.type === "date"
                        ? "date"
                        : f.type === "url"
                          ? "url"
                          : "text"
                  }
                  value={extraFields[f.key] ?? ""}
                  min={f.type === "number" ? 0 : undefined}
                  onChange={(e) => {
                    const raw = e.target.value
                    if (f.type !== "number") {
                      onFieldChange(f.key, raw)
                      return
                    }
                    onFieldChange(f.key, normalizeNumberValue(raw))
                  }}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}