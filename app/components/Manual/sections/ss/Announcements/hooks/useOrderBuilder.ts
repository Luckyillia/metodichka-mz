import { useCallback } from 'react'
import type { WizardForm, DisciplinaryBuilder, OrderSettings } from '../types'
import { buildStatusLine } from '../utils/orderHelpers'
import { CITIES } from '../data'

export const useOrderBuilder = (settings: OrderSettings) => {
  const buildWizardText = useCallback((wizard: WizardForm): string => {
    const { category, targetName, targetPosition, dateFrom, dateTo, reason, isPenaltyFree, isOchs, ochsPoint, ochsReason, blacklistDays } = wizard

    const cityLabel = CITIES.find((c) => c.value === settings.city)?.label ?? settings.city

    switch (category) {
      case "Отпуск":
        return `Приказ о предоставлении отпуска:

Сотрудник ${targetName}, находясь в должности ${targetPosition}, отправляется в отпуск с ${dateFrom} по ${dateTo} включительно. Хорошего отдыха!`

      case "Увольнение":
        if (isOchs) {
          const days = blacklistDays && blacklistDays.trim() ? blacklistDays.trim() : "30"
          const point = ochsPoint.trim() || "0.1.11"
          const desc = ochsReason.trim() || ""
          const descBlock = desc ? ` (${desc})` : ""
          return `Приказ об увольнении:

Сотрудник ${targetName} находясь в должности (${targetPosition}), ${settings.hospital} города ${cityLabel}, с занесением в общий чёрный список для дальнейшего исключения возможности трудоустройства в организации сроком на ${days} дней по пункту ${point} ОЧС${descBlock}.

${buildStatusLine("dot")}`
        }
        return `Приказ об увольнении:

Сотрудник ${targetName} уволен из ${settings.hospital} города ${cityLabel}.
Причина: ${reason || "Собственное желание"}. ${isPenaltyFree ? "Неустойка не требуется." : "Неустойка оплачена."}
Должность при увольнении: (${targetPosition}).
Спасибо за проделанную медицинскую работу!

${buildStatusLine("dot")}`

      case "Приём":
        return `Приказ о принятии:

${targetName} принят в ${settings.hospital} города ${cityLabel} на должность ${targetPosition}.`

      case "Перевод":
        return `Приказ о переводе:

Сотрудник ${targetName} переводится на должность ${targetPosition}.`

      case "Назначения":
        return `Приказ о назначении должности:

Сотрудник ${targetName} назначается на должность ${targetPosition}.`

      case "ВрИО":
        return `Приказ о назначении ВрИО:

Сотрудник ${targetName} назначен ВрИО на должность ${targetPosition}.`

      default:
        return ""
    }
  }, [settings])

  const buildDisciplinaryText = useCallback((disciplinary: DisciplinaryBuilder): string => {
    if (disciplinary.people.length === 0) {
      return ""
    }

    const peopleText = disciplinary.people
      .map((person) => {
        const currentPenalty = person.penalty?.trim() || "Выговор"
        const articleBlock = person.articleDescription
          ? `${person.article} (${person.articleDescription})`
          : person.article
        const complaintBlock = person.complaintUrl
          ? `\nПо жалобе: ${person.complaintUrl}`
          : ""

        return `${person.name}, находясь в должности ${person.position} получает взыскание в виде ${currentPenalty} и несёт ответственность по пункту ${articleBlock}${complaintBlock}

Текущее состояние:
УП-${person.up}/5, П-${person.p}/5, В-${person.v}/3.`
      })
      .join("\n\n")

    return `Приказ о выдаче служебного взыскания:

${peopleText}`
  }, [])

  return {
    buildWizardText,
    buildDisciplinaryText,
  }
}