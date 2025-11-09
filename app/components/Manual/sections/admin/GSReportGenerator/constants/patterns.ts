export const SECTION_PATTERNS = {
    interviews: /2\).*?собеседований[^]*?(?=3\)|$)/is,
    hiredFired: /3\).*?(?=4\)|$)/is,
    staff: /4\).*?(?=5\)|$)/is,
    calls: /5\).*?обзвон[^]*?(?=6\)|$)/is,
    staffChanges: /6\).*?перестановок[^]*?(?=7\)|$)/is,
    warnings: /7\).*?выговоров[^]*?(?=8\)|$)/is,
    fund: /8\).*?(?=9\)|$)/is,
    allEvents: /9\).*?(?=10\)|$)/is,
    lectures: /Лекции:([^]*?)(?=Тренировки:|Мероприятия:|Проведение|10\)|$)/i,
    trainings: /Тренировки:([^]*?)(?=Мероприятия:|Проведение|10\)|$)/i,
    events: /Мероприятия:([^]*?)(?=10\)|11\)|12\)|Тренировки:|Проведение|$)/i,
    branchEvents: /10\).*?филиалов[^]*?(?=11\)|$)/is,
    interfaction: /11\).*?межфракционных[^]*?(?=12\)|$)/is,
    evaluations: /13\).*?старшего состава[^]*?(?=14\)|$)/is
} as const;

export const FIELD_PATTERNS = {
    totalHired: /Кол-во принятых\s*-\s*(\d+)/i,
    firedPSJ: /Кол-во уволенных ПСЖ\s*-\s*(\d+)/i,
    firedOCS: /Кол-во уволенных с ОЧС\s*-\s*(\d+)/i,
    totalFired: /Общее кол-во уволенных\s*-\s*(\d+)/i,
    firstRanks: /Первые ранги\s*-\s*(\d+)/i,
    middleStaff: /Средний состав\s*-\s*(\d+)/i,
    seniorStaff: /Старший состав\s*-\s*(\d+)/i,
    managementStaff: /Руководящий состав\s*-\s*(\d+)/i,
    totalStaff: /Общее количество сотрудников\s*-\s*(\d+)/i,
    callsPerWeek: /Количество обзвонов за неделю\s*-\s*(\d+)/i,
    callsAccepted: /Количество принятых\s*-\s*(\d+)/i,
    fundReceived: /Получено\s*-+\s*(\d+)/i,
    fundPaid: /Выплачено\s*-+\s*(\d+)/i,
    fundBalance: /Остаток\s*-+\s*(\d+к?)/i
} as const;

export const ITEM_PATTERNS = {
    link: /https?:\/\/[^\s]+/g,
    eventItem: /\d+\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/,
    linkOnly: /\d+\.\s*(https?:\/\/[^\s]+)/,
    warning: /(.+?)\s*-\s*(.+)/,
    evaluation: /(.+?)\s*-\s*(\d+\/\d+)\s*(.+)/
} as const;