import type { Order } from '../types'
import { buildStatusLine } from '../utils'

type HeaderVariant = "gv" | "gv_sa"

type OrderTemplateParams = {
  id: string
  title: string
  category: string
  tags: string[]
  builder?: {
    fields: Array<{
      key: string
      label: string
      type: "text" | "textarea" | "number" | "date" | "url"
      placeholder?: string
    }>
  }
  headerVariant?: HeaderVariant
  body: string
  statusVariant?: "default" | "dot" | "none"
}

const createOrderTemplate = ({
  id,
  title,
  category,
  tags,
  builder,
  headerVariant = "gv",
  body,
  statusVariant = "default"
}: OrderTemplateParams): Order => {
  void headerVariant
  const statusBlock = statusVariant === "none" ? undefined : buildStatusLine(statusVariant)
  return {
    id,
    title,
    category,
    tags,
    builder,
    content: statusBlock ? `${body}\n\n${statusBlock}` : body
  }
}

export const medicalOrders: Order[] = [
  createOrderTemplate({
    id: "priem-intern-open",
    title: "Принятие в МУ на должность Интерна (открытое)",
    category: "Приём",
    tags: ["Принят", "Открытому"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `Приказ о принятии в Медицинский Университет:  
{TARGET_NAME} принят в Медицинский Университет {HOSPITAL} г. {CITY} по результатам открытого собеседования на должность Интерна. Желаем успешного продвижения в работе!  
Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3`,
    statusVariant: "none"
  }),

  createOrderTemplate({
    id: "perevod-imu",
    title: "Перевод в ИМУ",
    category: "Перевод",
    tags: ["ИМУ"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `Приказ о переводе сотрудника:
На основании поданного заявления и в соответствии с внутренними кадровыми процедурами, сотрудник {TARGET_NAME} переводится в отдел Инструкторов Медицинского Университета!
Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3`,
    statusVariant: "none"
  }),

  createOrderTemplate({
    id: "perevod-mezhdu-filialami",
    title: "Перевод между филиалами",
    category: "Перевод",
    tags: ["Перевод"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_HOSPITAL_FULL", label: "Куда переводится (больница полностью)", type: "text", placeholder: "Центральную Городскую Больницу" },
        { key: "TARGET_CITY", label: "Куда переводится (город)", type: "text", placeholder: "Приволжск" },
        { key: "TARGET_POSITION", label: "Новая должность", type: "text", placeholder: "Врач-терапевт" },
        { key: "APPLICATION_URL_LINE", label: "Ссылка на заявление (опционально)", type: "url", placeholder: "https://..." },
      ]
    },
    body: `Приказ о переводе сотрудника:
Сотрудник {TARGET_NAME} переводится из организации {HOSPITAL_FULL} города {CITY} в {TARGET_HOSPITAL_FULL} города {TARGET_CITY} на должность «{TARGET_POSITION}».{APPLICATION_URL_LINE}
Текущее положение: УП - {UP}/5; П - {P}/5; В - {V}/3`,
    statusVariant: "none"
  }),

  createOrderTemplate({
    id: "otpusk",
    title: "Предоставление отпуска",
    category: "Отпуск",
    tags: ["Отпуск"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность сотрудника", type: "text", placeholder: "Врач-хирург" },
        { key: "DATE_FROM", label: "Дата начала", type: "text", placeholder: "ДД.ММ.ГГГГ" },
        { key: "DATE_TO", label: "Дата окончания", type: "text", placeholder: "ДД.ММ.ГГГГ" },
      ]
    },
    body: `
Приказ о предоставлении отпуска:

Сотрудник {TARGET_NAME}, находясь в должности {TARGET_POSITION}, отправляется в отпуск с {DATE_FROM} по {DATE_TO} включительно. Хорошего отдыха!

`,
  }),

  createOrderTemplate({
    id: "snyatie-vrio-zav",
    title: "Снятие ВрИО срока (Заведующий)",
    category: "ВрИО",
    tags: ["ВрИО", "снятие", "заведующий"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Заведующий ОЛД" },
      ]
    },
    body: `
Приказ о снятии ВрИО срока:

Сотрудник {TARGET_NAME} успешно проходит ВрИО срок и становится на полноценную должность {TARGET_POSITION}.

`,
  }),

  createOrderTemplate({
    id: "perevod-universal",
    title: "Перевод на должность (универсальный)",
    category: "Перевод",
    tags: ["перевод", "универсальный"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "FROM_POSITION", label: "С какой должности (опционально)", type: "text", placeholder: "Интерн" },
        { key: "TARGET_POSITION", label: "На какую должность", type: "text", placeholder: "Врач-терапевт" },
        { key: "TARGET_DEPARTMENT", label: "Отдел (опционально)", type: "text", placeholder: "ОТХ" },
        { key: "REASON", label: "Основание (опционально)", type: "text", placeholder: "по результатам отчётности" },
      ]
    },
    body: `
Приказ о переводе:  

Сотрудник {TARGET_NAME} переводится{FROM_POSITION} на должность {TARGET_POSITION}.{TARGET_DEPARTMENT_LINE}
Основание: {REASON}.
`,
  }),

  createOrderTemplate({
    id: "naznachenie-zam-gv-mu",
    title: "Назначение на должность (Зам.Нач.ГВ-МУ)",
    category: "Назначения",
    tags: ["Зам", "ГВ-МУ", "Заместитель"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о кадровых перестановках:

Сотрудник {TARGET_NAME} назначен на должность «Заместитель начальника главного военно-медицинского управления».
`,
  }),

  createOrderTemplate({
    id: "naznachenie-kom-gv-mu",
    title: "Назначение на должность (Ком.ГВ-МУ)",
    category: "Назначения",
    tags: ["Командир", "ГВ-МУ"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о кадровых перестановках:

Сотрудник {TARGET_NAME} назначен на должность «Командир военно-медицинским отделом».
`,
  }),

  createOrderTemplate({
    id: "naznachenie-nach-imu",
    title: "Назначение на должность (Начальник ИМУ)",
    category: "Назначения",
    tags: ["Начальник", "ИМУ"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о кадровых перестановках:

Сотрудник {TARGET_NAME} назначен на должность «Начальник ИМУ».
`,
  }),

  createOrderTemplate({
    id: "naznachenie-zaveduyushiy",
    title: "Назначение на должность (Заведующий)",
    category: "Назначения",
    tags: ["Назначение", "Зав", "Заведующий"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Заведующий ОЛД" },
        { key: "VRIO_DAYS", label: "ВрИО срок (дней)", type: "number", placeholder: "7" },
      ]
    },
    body: `
Приказ о кадровых перестановках:

{TARGET_NAME} — назначен на должность: {TARGET_POSITION}.

ВрИО срок {VRIO_DAYS} дней.
`,
  }),

  createOrderTemplate({
    id: "naznachenie-zam-gv",
    title: "Назначение на должность (Заместитель)",
    category: "Назначения",
    tags: ["Назначение", "Зам", "Заместитель главного врача"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Заместитель Главного Врача по организационно-методической работе" },
      ]
    },
    body: `
Приказ о кадровых перестановках:

{TARGET_NAME} — назначен на должность: {TARGET_POSITION}.
`,
  }),

  createOrderTemplate({
    id: "naznachenie-zam-nach-sa",
    title: "Назначение на должность (Зам.Нач.СА)",
    category: "Назначения",
    tags: ["Назначение", "СА"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о кадровых перестановках:

Сотрудник {TARGET_NAME} назначен на должность «Заместитель Начальника санитарной авиации».
`,
  }),

  createOrderTemplate({
    id: "naznachenie-nach-sa",
    title: "Назначение на должность (Нач.СА)",
    category: "Назначения",
    tags: ["Назначение", "СА"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о кадровых перестановках:

Сотрудник {TARGET_NAME} назначен на должность «Начальник санитарной авиации».
`,
  }),

  createOrderTemplate({
    id: "perevod-v-sa-psa",
    title: "Перевод в СА (ПСА)",
    category: "СА",
    tags: ["Перевод", "СА", "ПСА"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о переводе сотрудника:

На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в отдел Санитарной Авиации на должность Пилота Санитарной Авиации. Желаем успехов, продуктивной работы и роста в новых обязанностях!
`,
  }),

  createOrderTemplate({
    id: "perevod-v-sa-fsa",
    title: "Перевод в СА (ФСА)",
    category: "СА",
    tags: ["Перевод", "СА", "ФСА"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о переводе сотрудника:

На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в отдел Санитарной Авиации на должность Фельдшера Санитарной Авиации. Желаем успехов, продуктивной работы и роста в новых обязанностях!
`,
  }),

  createOrderTemplate({
    id: "vostanovlenie-ss",
    title: "Восстановление в СС",
    category: "Приём",
    tags: ["Восстановление", "Приём"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о принятии в Старший состав:

Сотрудник {TARGET_NAME} восстановлен в Старший состав {HOSPITAL_FULL} города {CITY} по результатам закрытого собеседования и снова готов приступить к своим обязанностям с новыми силами. Рады видеть вас снова!
`,
  }),

  createOrderTemplate({
    id: "snyatie-vrio-zam",
    title: "Снятие ВрИО срока (Заместитель)",
    category: "ВрИО",
    tags: ["ВрИО", "снятие", "заместитель"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Заместитель главного врача" },
      ]
    },
    body: `
Приказ о снятии ВрИО срока:

Сотрудник {TARGET_NAME} успешно проходит ВрИО срок и становится на полноценную должность {TARGET_POSITION}.
`,
  }),

  createOrderTemplate({
    id: "dosrochnoe-vozvrat",
    title: "Досрочное возвращение из отпуска",
    category: "Отпуск",
    tags: ["отпуск", "досрочное возвращение"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о возвращении из отпуска:

{TARGET_NAME} - досрочно выходит из отпуска.
`,
  }),

  createOrderTemplate({
    id: "vozvrat-iz-otpuska",
    title: "Возвращение из отпуска",
    category: "Отпуск",
    tags: ["отпуск", "возвращение"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о возвращении с отпуска:

Сотрудник {TARGET_NAME} возвращается из отпуска и приступает к своим должностным обязанностям.
`,
  }),

  createOrderTemplate({
    id: "uvolnenie-psj-bez",
    title: "Увольнение по собственному желанию (без неустойки)",
    category: "Увольнения",
    tags: ["увольнение", "собственное желание"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность при увольнении", type: "text", placeholder: "Врач-хирург" },
      ]
    },
    body: `
Приказ об увольнении:  

Сотрудник {TARGET_NAME} уволен из {HOSPITAL_FULL} города {CITY}.
Причина: Собственное желание. Неустойка не требуется.
Должность при увольнении: ({TARGET_POSITION}).
Спасибо за проделанную медицинскую работу!
`,
  }),

  createOrderTemplate({
    id: "uvolnenie-ochs-0111",
    title: "Увольнение по ОЧС 0.1.11 (Самолив)",
    category: "Увольнения",
    tags: ["увольнение", "ОЧС", "самолив", "черный список"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Врач-хирург" },
      ]
    },
    body: `
Приказ об увольнении:  

Сотрудник {TARGET_NAME} находясь в должности ({TARGET_POSITION}), {HOSPITAL_FULL} города {CITY}, с занесением в общий чёрный список для дальнейшего исключения возможности трудоустройства в организации сроком на 30 дней по пункту 0.1.11 ОЧС (Самолив из оф.бесед).
`,
  }),

  createOrderTemplate({
    id: "uvolnenie-ochs-013",
    title: "Увольнение по ОЧС 0.1.3 (Бан 10+ дней)",
    category: "Увольнения",
    tags: ["увольнение", "ОЧС", "бан", "черный список"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Врач-хирург" },
      ]
    },
    body: `
Приказ об увольнении:  

Сотрудник {TARGET_NAME} находясь в должности ({TARGET_POSITION}), покидает {HOSPITAL_FULL} города {CITY}, с занесением в общий чёрный список для дальнейшего исключения возможности трудоустройства в организации сроком на 30 дней по пункту 0.1.3 ОЧС (Бан на 10 и более дней).
`,
  }),

  createOrderTemplate({
    id: "uvolnenie-ochs-019",
    title: "Увольнение по ОЧС 0.1.9 (Неактив)",
    category: "Увольнения",
    tags: ["увольнение", "ОЧС", "неактив", "черный список"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Интерн" },
        { key: "BLACKLIST_DAYS", label: "Срок ЧС (дней)", type: "number", placeholder: "60" },
      ]
    },
    body: `
Приказ об увольнении:

Сотрудник {TARGET_NAME} находясь в должности {TARGET_POSITION}, покидает {HOSPITAL_FULL} города {CITY}, с занесением в общий чёрный список для дальнейшего исключения возможности трудоустройства в организации сроком на {BLACKLIST_DAYS} дней за нарушение пункта 0.1.9 ОЧС (Продолжительный неактив без предупреждения).
`,
  }),

  createOrderTemplate({
    id: "priem-intern-closed",
    title: "Принятие в МУ на должность Интерна (закрытое)",
    category: "Приём",
    tags: ["приём", "интерн", "закрытое собеседование"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о принятии в Медицинский Университет:  

{TARGET_NAME} принят в Медицинский Университет {HOSPITAL} г. {CITY} по результатам закрытого собеседования на должность Интерна. Желаем успешного продвижения в работе!
`,
  }),

  createOrderTemplate({
    id: "priem-old",
    title: "Принятие в ОЛД (восстановление)",
    category: "Приём",
    tags: ["приём", "ОЛД", "восстановление"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
Приказ о принятии в Отдел Лабораторной Диагностики:  

{TARGET_NAME} восстанавливается в Отдел Лабораторной Диагностики {HOSPITAL} г. {CITY} по результатам закрытого собеседования на должность врач-участковый. Рады видеть вас снова!
`,
  }),

  createOrderTemplate({
    id: "povyshenie-old",
    title: "Повышение классификации с переводом в ОЛД",
    category: "Повышения",
    tags: ["повышение", "классификация", "перевод", "ОЛД"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "FROM_POSITION", label: "С какой должности", type: "text", placeholder: "Интерна" },
        { key: "TO_POSITION", label: "На какую должность", type: "text", placeholder: "Лаборант" },
      ]
    },
    body: `
Приказ о повышении классификации сотрудника:  

Сотрудник {TARGET_NAME} повышается в классификации с {FROM_POSITION} до {TO_POSITION} в связи с успешной сдачей отчётности.
На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в Отдел Лабораторной Диагностики (далее ОЛД).
Продолжайте в том же духе!
`,
  }),

  createOrderTemplate({
    id: "povyshenie-oth",
    title: "Повышение классификации с переводом в ОТХ",
    category: "Повышения",
    tags: ["повышение", "классификация", "перевод", "ОТХ"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "FROM_POSITION", label: "С какой должности", type: "text", placeholder: "Интерна" },
        { key: "TO_POSITION", label: "На какую должность", type: "text", placeholder: "Врач-Терапевт" },
      ]
    },
    body: `
Приказ о повышении классификации сотрудника:  

Сотрудник {TARGET_NAME} повышается в классификации с {FROM_POSITION} до {TO_POSITION} в связи с успешной сдачей отчётности.
На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в Отдел Терапии и Хирургии (далее - ОТХ).
Продолжайте в том же духе!
`,
  }),

  createOrderTemplate({
    id: "pooshchrenie-2",
    title: "Поощрение сотрудника (расширенное)",
    category: "Поощрения",
    tags: ["поощрение", "премия", "ответственность"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность сотрудника", type: "text", placeholder: "Врач-хирург" },
        { key: "AMOUNT", label: "Сумма премии", type: "number", placeholder: "200000" },
        { key: "SCREEN_URL", label: "Скрин перевода (опционально)", type: "url", placeholder: "https://..." },
      ]
    },
    body: `
За проявленный высокий уровень профессиональной ответственности, активное участие в жизни {HOSPITAL_FULL} города {CITY}, инициативность и качественное выполнение должностных обязанностей, сотруднику {TARGET_NAME}, занимающему должность {TARGET_POSITION}, выплачивается премия в размере {AMOUNT}.
Продолжайте в том же духе!
Скрин перевода: {SCREEN_URL}
`,
  }),

  createOrderTemplate({
    id: "sobranie-mp",
    title: "Собрание всего состава (Мероприятие)",
    category: "Собрания",
    tags: ["собрание", "мероприятие", "премия"],
    builder: {
      fields: [
        { key: "DATE", label: "Дата", type: "text", placeholder: "10.04.25" },
        { key: "TIME", label: "Время", type: "text", placeholder: "17:00" },
        { key: "RESPONSIBLE", label: "Ответственный", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `
Приказ о собрании всего состава:  

{DATE} в {TIME} по МСК состоится сбор всего состава для проведения совместного мероприятия.
Ответственный за построение: {RESPONSIBLE}.
Явка на смене обязательна. Премии присутствуют.
`,
  }),

  createOrderTemplate({
    id: "ezhenedelnoe-postroenie",
    title: "Еженедельное построение",
    category: "Собрания",
    tags: ["построение", "еженедельное", "премия"],
    builder: {
      fields: [
        { key: "DATE", label: "Дата", type: "text", placeholder: "14.04.2025" },
        { key: "TIME", label: "Время", type: "text", placeholder: "21:00" },
      ]
    },
    body: `
Завтра, {DATE} в {TIME} пройдет еженедельное построение всего состава {HOSPITAL} города {CITY}. На нем подведём итоги уходящей недели, обсудим рабочие моменты. В конце построения, сотрудникам будут выплачены премии.
`,
  }),

  createOrderTemplate({
    id: "forum-gotov",
    title: "Готовность форумного раздела",
    category: "Прочее",
    tags: ["форум", "обновление"],
    builder: {
      fields: [{ key: "FORUM_URL", label: "Ссылка на форум", type: "url", placeholder: "https://forum.gtaprovince.ru/..." }]
    },
    body: `
Уважаемые сотрудники, коллеги! Форумный раздел {HOSPITAL} г. {CITY} полностью обновлён, доработан и скорректирован. Если вы желаете ознакомиться, то просто перейдите по ссылке:
{FORUM_URL}
`,
  }),

  createOrderTemplate({
    id: "smena-pasporta",
    title: "Смена паспортных данных",
    category: "Прочее",
    tags: ["паспорт", "смена данных"],
    builder: {
      fields: [
        { key: "OLD_NAME", label: "Старое имя", type: "text", placeholder: "Имя_Фамилия" },
        { key: "NEW_NAME", label: "Новое имя", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `
Сотрудник {OLD_NAME} меняет свои паспортные данные на {NEW_NAME}.
`,
  }),
]

export const getOrderById = (id: string): Order | undefined => {
  return medicalOrders.find(order => order.id === id)
}

export const getOrdersByCategory = (category: string): Order[] => {
  return medicalOrders.filter(order => order.category === category)
}

export const getOrderCategories = (): string[] => {
  return Array.from(new Set(medicalOrders.map(order => order.category)))
}