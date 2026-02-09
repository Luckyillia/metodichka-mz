export type OrderBuilderFieldType = "text" | "textarea" | "number" | "date" | "url"

export interface OrderBuilderField {
  key: string
  label: string
  type: OrderBuilderFieldType
  placeholder?: string
}

export interface OrderBuilderMeta {
  fields: OrderBuilderField[]
}

export interface Order {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
  builder?: OrderBuilderMeta
}

export interface OrderSettings {
  position: string
  positionCustom: string
  hospital: string
  city: string
  myName: string
  targetName: string
  up: string
  p: string
  v: string
  headerCustomTitle: string
  headerShowHospitalCity: boolean
}

export type WizardCategory =
  | "Взыскания"
  | "Отпуск"
  | "Увольнение"
  | "Приём"
  | "Перевод"
  | "ВрИО"
  | "Назначения"

export interface WizardForm {
  category: WizardCategory
  targetName: string
  targetPosition: string
  dateFrom: string
  dateTo: string
  reason: string
  isPenaltyFree: boolean
  isOchs: boolean
  ochsPoint: string
  ochsReason: string
  blacklistDays: string
}

export interface DisciplinaryPerson {
  name: string
  position: string
  up: string
  p: string
  v: string
  article: string
  articleDescription: string
  complaintUrl: string
}

export interface DisciplinaryBuilder {
  people: DisciplinaryPerson[]
  penalty: string
}

export interface CityOption {
  value: string
  label: string
  hospital: string
}

export interface PositionOption {
  value: string
  label: string
}