import React from 'react'
import type { OrderSettings } from '../types'
import type { CityOption, PositionOption } from '../types'

interface OrderSettingsFormProps {
  settings: OrderSettings
  onSettingChange: (key: keyof OrderSettings, value: string) => void
  positions: PositionOption[]
  cities: CityOption[]
  derivedHospital: string
  buildHeaderLine: () => string
  replaceInContent: (content: string) => string
}

export const OrderSettingsForm: React.FC<OrderSettingsFormProps> = ({
  settings,
  onSettingChange,
  positions,
  cities,
  derivedHospital,
  buildHeaderLine,
  replaceInContent,
}) => {
  return (
    <div className="p-4 rounded-lg border-2 border-border bg-muted/20">
      <h5 className="text-sm font-semibold mb-3 text-foreground">⚙️ Шапка и персонализация</h5>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Твоя должность:</label>
          <select
            value={settings.position}
            onChange={(e) => onSettingChange("position", e.target.value)}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {positions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Своя должность (опционально):</label>
          <input
            type="text"
            value={settings.positionCustom}
            onChange={(e) => onSettingChange("positionCustom", e.target.value)}
            placeholder="например: Следящий за фракцией"
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Город:</label>
          <select
            value={settings.city}
            onChange={(e) => {
              const nextCity = e.target.value
              onSettingChange("city", nextCity)
              const c = cities.find((x) => x.value === nextCity)
              if (c?.hospital) onSettingChange("hospital", c.hospital)
            }}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {cities.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Больница:</label>
          <input
            type="text"
            value={derivedHospital}
            readOnly
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">Твоё имя:</label>
          <input
            type="text"
            value={settings.myName}
            onChange={(e) => onSettingChange("myName", e.target.value)}
            placeholder="Имя_Фамилия"
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <input
              id="headerShowHospitalCity"
              type="checkbox"
              checked={settings.headerShowHospitalCity}
              onChange={(e) => onSettingChange("headerShowHospitalCity", e.target.checked ? "true" : "false")}
              className="h-4 w-4"
            />
            <label htmlFor="headerShowHospitalCity" className="text-sm text-foreground">
              Показывать больницу/город в шапке
            </label>
          </div>
        </div>

        <div className="mt-2 md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-foreground">Титул без города (опционально):</label>
          <input
            type="text"
            value={settings.headerCustomTitle}
            onChange={(e) => onSettingChange("headerCustomTitle", e.target.value)}
            placeholder="Министр Здравоохранения"
            disabled={settings.headerShowHospitalCity}
            className={`w-full px-3 py-2 border-2 border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
              settings.headerShowHospitalCity
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-background text-foreground"
            }`}
          />
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg border-2 border-border bg-background/50">
        <p className="text-xs text-muted-foreground mb-1">Текущая шапка:</p>
        <pre className="text-xs whitespace-pre-wrap text-foreground">{replaceInContent(buildHeaderLine())}</pre>
      </div>
    </div>
  )
}