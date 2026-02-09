import React from 'react'
import type { OrderSettings } from '../types'

interface StateFieldsProps {
  settings: OrderSettings
  onSettingChange: (key: keyof OrderSettings, value: string) => void
}

export const StateFields: React.FC<StateFieldsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <div className="p-3 rounded-lg border border-border bg-background/50">
      <p className="text-sm font-semibold text-foreground mb-2">Состояние</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">УП:</label>
          <input
            type="number"
            min="0"
            max="5"
            value={settings.up}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === "") {
                onSettingChange("up", "")
                return
              }
              const n = Number.parseInt(raw, 10)
              const clamped = Number.isFinite(n) ? Math.min(5, Math.max(0, n)) : 0
              onSettingChange("up", clamped.toString())
            }}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">П:</label>
          <input
            type="number"
            min="0"
            max="5"
            value={settings.p}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === "") {
                onSettingChange("p", "")
                return
              }
              const n = Number.parseInt(raw, 10)
              const clamped = Number.isFinite(n) ? Math.min(5, Math.max(0, n)) : 0
              onSettingChange("p", clamped.toString())
            }}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground">В:</label>
          <input
            type="number"
            min="0"
            max="3"
            value={settings.v}
            onChange={(e) => {
              const raw = e.target.value
              if (raw === "") {
                onSettingChange("v", "")
                return
              }
              const n = Number.parseInt(raw, 10)
              const clamped = Number.isFinite(n) ? Math.min(3, Math.max(0, n)) : 0
              onSettingChange("v", clamped.toString())
            }}
            className="w-full px-3 py-2 border-2 border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  )
}