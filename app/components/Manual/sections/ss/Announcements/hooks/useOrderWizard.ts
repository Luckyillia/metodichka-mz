import { useEffect, useState, useCallback } from 'react'
import type { WizardForm, DisciplinaryBuilder, DisciplinaryPerson } from '../types'

const WIZARD_SET_CATEGORY_EVENT = "ss_order_wizard_set_category"
const DISCIPLINARY_PENALTY_STORAGE_KEY = "ss_disciplinary_penalty_v1"

const DEFAULT_WIZARD: WizardForm = {
  category: "Взыскания",
  targetName: "",
  targetPosition: "",
  dateFrom: "",
  dateTo: "",
  reason: "",
  isPenaltyFree: false,
  isOchs: false,
  ochsPoint: "",
  ochsReason: "",
  blacklistDays: "",
}

const DEFAULT_DISCIPLINARY: DisciplinaryBuilder = {
  people: [],
}

export const useOrderWizard = () => {
  const [wizard, setWizard] = useState<WizardForm>(DEFAULT_WIZARD)
  const [disciplinary, setDisciplinary] = useState<DisciplinaryBuilder>(DEFAULT_DISCIPLINARY)

  useEffect(() => {
    const handler = (ev: Event) => {
      const e = ev as CustomEvent<{ category?: WizardForm["category"] }>
      const category = e.detail?.category
      if (!category) return
      setWizard((prev) => ({ ...prev, category }))
    }

    window.addEventListener(WIZARD_SET_CATEGORY_EVENT, handler)
    return () => window.removeEventListener(WIZARD_SET_CATEGORY_EVENT, handler)
  }, [])

  const updateWizard = useCallback((updates: Partial<WizardForm>) => {
    setWizard(prev => ({ ...prev, ...updates }))
  }, [])

  const resetWizard = useCallback(() => {
    setWizard(DEFAULT_WIZARD)
  }, [])

  const addDisciplinaryPerson = useCallback(() => {
    setDisciplinary(prev => ({
      ...prev,
      people: [
        ...prev.people,
        {
          name: "",
          position: "",
          up: "0",
          p: "0",
          v: "0",
          article: "",
          articleDescription: "",
          complaintUrl: "",
          penalty: "Выговор",
        },
      ],
    }))
  }, [])

  const updateDisciplinaryPerson = useCallback(
    (index: number, updates: Partial<DisciplinaryPerson>) => {
      setDisciplinary(prev => ({
        ...prev,
        people: prev.people.map((person, i) =>
          i === index ? { ...person, ...updates } : person
        ),
      }))
    },
    []
  )

  const removeDisciplinaryPerson = useCallback((index: number) => {
    setDisciplinary(prev => ({
      ...prev,
      people: prev.people.filter((_, i) => i !== index),
    }))
  }, [])

  const resetDisciplinary = useCallback(() => {
    setDisciplinary(DEFAULT_DISCIPLINARY)
  }, [])

  return {
    wizard,
    setWizard,
    updateWizard,
    resetWizard,
    disciplinary,
    setDisciplinary,
    addDisciplinaryPerson,
    updateDisciplinaryPerson,
    removeDisciplinaryPerson,
    resetDisciplinary,
  }
}