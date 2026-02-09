import type { OrderSettings, DisciplinaryPerson } from '../types'

export const validateSettings = (settings: OrderSettings): boolean => {
  return !!(settings.myName && settings.hospital && settings.city)
}

export const validateDisciplinaryPerson = (person: DisciplinaryPerson): boolean => {
  return !!(person.name && person.article)
}

export const validateStateValue = (
  value: string,
  max: number = 5
): boolean => {
  const num = parseInt(value)
  return !isNaN(num) && num >= 0 && num <= max
}

export const validateDateFormat = (date: string): boolean => {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/
  return regex.test(date)
}

export const validateUrl = (url: string): boolean => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}