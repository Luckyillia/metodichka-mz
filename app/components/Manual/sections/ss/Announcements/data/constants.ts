import type { CityOption, PositionOption } from '../types'

export const CITIES: CityOption[] = [
  { value: "privolzhsk", label: "Приволжск", hospital: "Центральную Городскую Больницу" },
  { value: "mirnuy", label: "Мирный", hospital: "Городскую Больницу" },
]

export const POSITIONS: PositionOption[] = [
  { value: "gv", label: "Главный Врач" },
  { value: "zam_gv", label: "Заместитель Главного Врача" },
  { value: "nach_sa", label: "Начальник Санитарной Авиации" },
  { value: "zam_nach_sa", label: "Заместитель Начальника Санитарной Авиации" },
]

export const DEFAULT_SETTINGS = {
  position: "gv",
  positionCustom: "",
  hospital: "Центральную Городскую Больницу",
  city: "Приволжск",
  myName: "",
  targetName: "",
  up: "0",
  p: "0",
  v: "0",
  headerCustomTitle: "",
  headerShowHospitalCity: true,
}

export const WIZARD_CATEGORIES = [
  "Взыскания",
  "Отпуск",
  "Увольнение",
  "Приём",
  "Перевод",
  "ВрИО",
  "Назначения",
] as const