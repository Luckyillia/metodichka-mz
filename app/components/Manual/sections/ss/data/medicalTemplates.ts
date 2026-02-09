// medicalTemplates.ts - Файл с шаблонами приказов

export interface Order {
  id: string
  title: string
  category: string
  content: string
  tags: string[]
  builder?: OrderBuilderMeta
}

export type OrderBuilderFieldType = "text" | "textarea" | "number" | "date" | "url"

export type OrderBuilderField = {
  key: string
  label: string
  type: OrderBuilderFieldType
  placeholder?: string
}

export type OrderBuilderMeta = {
  fields: OrderBuilderField[]
}

type HeaderVariant = "gv" | "gv_sa"

const buildHeader = (variant: HeaderVariant) => {
  if (variant === "gv_sa") {
    return `[Заместитель Главного Врача {HOSPITAL_FULL} города {CITY} | {MY_NAME} Начальник Санитарной Авиации | {MY_NAME} ]`
  }

  return `[Главный Врач {HOSPITAL_FULL} города {CITY} | {MY_NAME} ]`
}

const buildStatusLine = (variant: "default" | "dot") => {
  if (variant === "dot") {
    return `Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3.`
  }

  return `Состояние на данный момент: УП - {UP}/5; П - {P}/5; В - {V}/3`
}

const trimEndNewlines = (value: string) => value.replace(/[\n\r]+$/g, "")

const joinHeaderBodyStatus = (header: string, body: string, status?: string) => {
  const normalizedHeader = trimEndNewlines(header)
  const normalizedBody = body.replace(/^[\n\r]+/, "")
  const base = `${normalizedHeader}\n\n${normalizedBody}`
  if (!status) return base
  return `${trimEndNewlines(base)}\n\n${status}`
}

type OrderTemplateParams = {
  id: string
  title: string
  category: string
  tags: string[]
  builder?: OrderBuilderMeta
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
  const statusBlock = statusVariant === "none" ? undefined : buildStatusLine(statusVariant)
  return {
    id,
    title,
    category,
    tags,
    builder,
    content: joinHeaderBodyStatus(buildHeader(headerVariant), body, statusBlock)
  }
}

type DisciplinaryPerson = {
  name: string
  position?: string
}

type DisciplinaryOrderParams = {
  id: string
  title: string
  tags: string[]
  people: DisciplinaryPerson[]
  article: string
  articleDescription?: string
  penalty: string
  complaintUrl?: string
}

const formatPeople = (people: DisciplinaryPerson[]) => {
  return people
    .map((p) => {
      if (p.position) return `${p.name}, находясь в должности ${p.position}`
      return p.name
    })
    .join("; ")
}

const createDisciplinaryOrder = ({
  id,
  title,
  tags,
  people,
  article,
  articleDescription,
  penalty,
  complaintUrl
}: DisciplinaryOrderParams): Order => {
  const articleBlock = articleDescription ? `${article} (${articleDescription})` : article
  const complaintBlock = complaintUrl ? `По жалобе: ${complaintUrl}` : undefined

  const body = `Приказ о выдаче служебного взыскания:  

${formatPeople(people)} получает взыскание в виде ${penalty} и несёт ответственность по пункту ${articleBlock}
${complaintBlock ? `${complaintBlock}\n` : ""}`

  return createOrderTemplate({
    id,
    title,
    category: "Взыскания",
    tags,
    body,
    statusVariant: "default"
  })
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

`
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

`
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

`
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
`
  }),
  createOrderTemplate({
    id: "naznachenie-universal",
    title: "Назначение на должность (универсальный)",
    category: "Назначения",
    tags: ["назначение", "универсальный"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Заведующий отделом" },
        { key: "TARGET_DEPARTMENT", label: "Отдел (опционально)", type: "text", placeholder: "ОЛД" },
        { key: "REASON", label: "Основание (опционально)", type: "text", placeholder: "по результатам обзвона" },
      ]
    },
    body: `
Приказ о постановлении на должность:

Сотрудник {TARGET_NAME} назначен на должность {TARGET_POSITION}.{TARGET_DEPARTMENT_LINE}
Основание: {REASON}.
`
  }),
  createOrderTemplate({
    id: "vrio-naznachenie-universal",
    title: "Назначение ВрИО (универсальный)",
    category: "ВрИО",
    tags: ["ВрИО", "назначение", "универсальный"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность ВрИО", type: "text", placeholder: "Заведующий ОТХ" },
        { key: "TARGET_DEPARTMENT", label: "Отдел (опционально)", type: "text", placeholder: "ОТХ" },
        { key: "VRIO_DAYS", label: "Срок ВрИО (дней)", type: "number", placeholder: "7" },
        { key: "REASON", label: "Основание (опционально)", type: "text", placeholder: "по результатам обзвона" },
      ]
    },
    body: `
Приказ о назначении ВрИО:

Сотрудник {TARGET_NAME} назначен ВрИО на должность {TARGET_POSITION}{TARGET_DEPARTMENT_LINE}
Срок ВрИО: {VRIO_DAYS} дней.
Основание: {REASON}.
`
  }),
  createOrderTemplate({
    id: "priem-universal",
    title: "Принятие на должность (универсальный)",
    category: "Приём",
    tags: ["приём", "универсальный"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность", type: "text", placeholder: "Врач-терапевт" },
        { key: "TARGET_DEPARTMENT", label: "Отдел (опционально)", type: "text", placeholder: "ОТХ" },
        { key: "REASON", label: "Основание (опционально)", type: "text", placeholder: "по результатам собеседования" },
      ]
    },
    body: `
Приказ о принятии:  

{TARGET_NAME} принят в {HOSPITAL_FULL} города {CITY} на должность {TARGET_POSITION}.{TARGET_DEPARTMENT_LINE}
Основание: {REASON}.
`
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

`
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

`
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

`
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

`
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

`
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

{DATE} в {TIME} по МСК состоится сбор всего состава для проведения совместного мероприятия с ЦГБ-П. 
Ответственный за построение: {RESPONSIBLE}.
Явка на смене обязательна. Премии присутствуют.
`
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
Завтра, {DATE} в {TIME} пройдет еженедельное построение всего состава {HOSPITAL} г.{CITY}. На нем подведём итоги уходящей недели, обсудим рабочие моменты. В конце построения, сотрудникам будут выплачены премии.
`
  }),
  createOrderTemplate({
    id: "priem-sa-feldsher",
    title: "Принятие в СА на должность Фельдшера",
    category: "СА",
    tags: ["СА", "фельдшер", "санитарная авиация"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в отдел Санитарной Авиации на должность Фельдшер Санитарной Авиации. С данного момента сотрудник имеет право оказывать высококвалифицированную медицинскую помощь и проводить технический осмотр ВСМП.

Желаем успехов, продуктивной работы и роста в новых обязанностях!

`
  }),
  createOrderTemplate({
    id: "priem-sa-pilot",
    title: "Принятие в СА на должность Пилота",
    category: "СА",
    tags: ["СА", "пилот", "санитарная авиация"],
    builder: {
      fields: [{ key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" }]
    },
    body: `
На основании поданного рапорта и в соответствии с кадровыми процедурами, сотрудник {TARGET_NAME} переводится в отдел Санитарной Авиации на должность Пилот Санитарной Авиации. С данного момента сотрудник имеет право пилотировать воздушное судно и способен оказывать высококвалифицированную медицинскую помощь.

`
  }),
  createOrderTemplate({
    id: "naznachenie-nach-sa-2",
    title: "Постановление на должность Начальника СА",
    category: "Назначения",
    tags: ["назначение", "начальник", "СА"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `
Сотрудник {TARGET_NAME} назначен на должность "Начальник Санитарной Авиации".

`
  }),
  createOrderTemplate({
    id: "naznachenie-zam-sa-2",
    title: "Постановление на должность Зам. Начальника СА",
    category: "Назначения",
    tags: ["назначение", "заместитель", "СА"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
      ]
    },
    body: `
Приказ о постановлении на должность:

Сотрудник {TARGET_NAME} назначен на должность "Заместитель Начальника Санитарной Авиации".

`
  }),
  createOrderTemplate({
    id: "naznachenie-ss",
    title: "Постановление новых сотрудников в СС",
    category: "Назначения",
    tags: ["назначение", "старший состав", "заведующий", "ВрИО"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник 1", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION", label: "Должность 1", type: "text", placeholder: "Заведующий ОТХ" },
        { key: "TARGET_NAME_2", label: "Сотрудник 2", type: "text", placeholder: "Имя_Фамилия" },
        { key: "TARGET_POSITION_2", label: "Должность 2", type: "text", placeholder: "Заведующий ВО" },
        { key: "VRIO_DAYS", label: "ВрИО срок (дней)", type: "number", placeholder: "7" },
      ]
    },
    body: `
Приказ о постановлении новых сотрудников в СС:

Сотрудник {TARGET_NAME} поставлен на должность {TARGET_POSITION} по результатам обзвона.
Сотрудник {TARGET_NAME_2} поставлен на должность {TARGET_POSITION_2} по результатам обзвона.

ВрИО срок {VRIO_DAYS} дней.

`
  }),
  createOrderTemplate({
    id: "perevod-otdel-oth",
    title: "Перевод на другой отдел",
    category: "Перевод",
    tags: ["перевод", "заведующий", "ОТХ"],
    builder: {
      fields: [
        { key: "TARGET_NAME", label: "Сотрудник", type: "text", placeholder: "Имя_Фамилия" },
        { key: "FROM_DEPARTMENT", label: "Откуда (отдел)", type: "text", placeholder: "ММУ" },
        { key: "TO_POSITION", label: "Новая должность", type: "text", placeholder: "заведующего отделом ОТХ" },
      ]
    },
    body: `
Учитывая успешное руководство отделом {FROM_DEPARTMENT}, сотрудник {TARGET_NAME} переводится на должность {TO_POSITION}.

Продолжайте в том же духе

`
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
`
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

`
  }),
]