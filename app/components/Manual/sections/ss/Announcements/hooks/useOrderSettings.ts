import { useState, useCallback, useMemo, useEffect } from 'react'
import type { OrderSettings } from '../types'
import { DEFAULT_SETTINGS, CITIES, POSITIONS } from '../data'
import { replaceVariables } from '../utils'

const ORDER_SETTINGS_STORAGE_KEY = "ss_order_settings_v1"
const SETTINGS_UPDATED_EVENT = "ss_order_settings_updated"

export const useOrderSettings = () => {
  const [settings, setSettings] = useState<OrderSettings>(() => {
    try {
      const raw = localStorage.getItem(ORDER_SETTINGS_STORAGE_KEY)
      if (!raw) return DEFAULT_SETTINGS
      const parsed = JSON.parse(raw) as Partial<OrderSettings>
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        headerShowHospitalCity:
          typeof parsed.headerShowHospitalCity === "boolean" ? parsed.headerShowHospitalCity : DEFAULT_SETTINGS.headerShowHospitalCity
      }
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  const updateSetting = useCallback((key: keyof OrderSettings, value: string) => {
    if (key === "headerShowHospitalCity") {
      const next = value === "true"
      setSettings((prev) => ({ ...prev, headerShowHospitalCity: next }))
      return
    }

    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateMultipleSettings = useCallback((updates: Partial<OrderSettings>) => {
    const normalized = { ...updates }
    if (typeof normalized.headerShowHospitalCity === "string") {
      normalized.headerShowHospitalCity = normalized.headerShowHospitalCity === "true"
    }
    setSettings(prev => ({ ...prev, ...normalized }))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(ORDER_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
      window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT))
    } catch {
      // ignore
    }
  }, [settings])

  const derivedHospital = useMemo(() => {
    const city = CITIES.find(c => c.value === settings.city)
    return city?.hospital ?? settings.hospital
  }, [settings.city, settings.hospital])

  const buildHeaderLine = useCallback(() => {
    if (!settings.headerShowHospitalCity && settings.headerCustomTitle) {
      return `[${settings.headerCustomTitle} | ${settings.myName}]`
    }

    const defaultPositionLabel = POSITIONS.find((p) => p.value === settings.position)?.label ?? settings.position
    const positionLabel = settings.positionCustom || defaultPositionLabel
    return `[${positionLabel} ${derivedHospital} города ${settings.city} | ${settings.myName}]`
  }, [settings, derivedHospital])

  const replaceInContent = useCallback((content: string) => {
    const normalized = content.trimStart()
    const withHeader = normalized.startsWith("[")
      ? content
      : `${buildHeaderLine()}\n\n${content}`
    return replaceVariables(withHeader, { ...settings, hospital: derivedHospital })
  }, [settings, derivedHospital, buildHeaderLine])

  return {
    settings,
    updateSetting,
    updateMultipleSettings,
    derivedHospital,
    buildHeaderLine,
    replaceInContent,
  }
}