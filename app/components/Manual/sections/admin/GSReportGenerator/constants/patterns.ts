export const SECTION_PATTERNS = {
    interviews: /2\).*?собеседований[^]*?(?=3\)|$)/i,
    hiredFired: /3\).*?(?=4\)|$)/i,
    staff: /4\).*?(?=5\)|$)/i,
    calls: /5\).*?обзвонов[^]*?(?=6\)|$)/i,
    staffChanges: /6\).*?перестановок[^]*?(?=7\)|$)/i,
    warnings: /7\).*?выговоров[^]*?(?=8\)|$)/i,
    fund: /8\).*?(?=9\)|$)/i,
    lectures: /Лекции:[^]*?(?=Тренировки:|Мероприятия:|10\)|$)/,
    trainings: /Тренировки:[^]*?(?=Мероприятия:|10\)|$)/,
    events: /Мероприятия:[^]*?(?=10\)|$)/,
    branchEvents: /10\).*?филиалов[^]*?(?=11\)|$)/,
    interfaction: /11\).*?межфракционных[^]*?(?=12\)|$)/,
    evaluations: /12\).*?старшего состава[^]*?$/
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
    fundReceived: /Получено\s*-\s*(\d+)/i,
    fundPaid: /Выплачено\s*-\s*(\d+)/i,
    fundBalance: /Остаток\s*-\s*(\d+)/i
} as const;

export const ITEM_PATTERNS = {
    link: /https?:\/\/[^\s]+/g,
    eventItem: /\d+\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/,
    linkOnly: /\d+\.\s*(https?:\/\/[^\s]+)/,
    warning: /(.+?)\s*-\s*(.+)/,
    evaluation: /(.+?)\s*-\s*(\d+\/\d+)\s*(.+)/
} as const;