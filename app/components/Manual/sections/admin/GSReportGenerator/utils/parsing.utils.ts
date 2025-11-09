import { SECTION_PATTERNS, FIELD_PATTERNS, ITEM_PATTERNS } from '../constants';
import { 
    ParsedData, 
    EventItem, 
    Warning, 
    StaffEvaluation,
    Interview 
} from '../types';

export const extractNumber = (text: string, pattern: RegExp): number => {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) || 0 : 0;
};

export const extractString = (text: string, pattern: RegExp): string => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
};

export const extractLinks = (text: string): string[] => {
    return text.match(ITEM_PATTERNS.link) || [];
};

export const extractInterviews = (text: string): Interview[] => {
    const interviews: Interview[] = [];
    const interviewsSection = text.match(SECTION_PATTERNS.interviews);
    
    if (interviewsSection) {
        extractLinks(interviewsSection[0]).forEach(link => {
            interviews.push({ link: link.trim() });
        });
    }
    
    return interviews;
};

// УЛУЧШЕННАЯ ФУНКЦИЯ: Более гибкое извлечение событий с именем и ссылкой
export const extractEventItems = (section: string): EventItem[] => {
    const items: EventItem[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === '-' || /^\d+\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки секций
        if (/^(Лекции:|Тренировки:|Мероприятия:|Проведение)/i.test(trimmedLine)) return;
        
        // Паттерн 1: Лекция "Название": ссылка
        const match1 = trimmedLine.match(/^(?:Лекция|Тренировка|Мероприятие)\s+"(.+?)":\s*(https?:\/\/[^\s]+)/i);
        if (match1) {
            items.push({
                name: match1[1].trim(),
                link: match1[2].trim()
            });
            return;
        }
        
        // Паттерн 2: "Название - ссылка" (универсальный, работает для любого формата)
        const match2 = trimmedLine.match(/^(?:\d+\.?\d*\s*)?(.+?)\s*-\s*(https?:\/\/[^\s]+)/);
        if (match2) {
            const name = match2[1].trim();
            // Убираем префиксы "Лекция", "Тренировка", "Мероприятие" если есть
            const cleanName = name.replace(/^(?:Лекция|Тренировка|Мероприятие)\s+/i, '').replace(/^["'](.+)["']$/, '$1');
            items.push({
                name: cleanName,
                link: match2[2].trim()
            });
            return;
        }
        
        // Паттерн 3: "Название ссылка" (без дефиса)
        const match3 = trimmedLine.match(/^(?:\d+\.?\d*\s*)?(?:Лекция|Тренировка|Мероприятие)?\s*["']?(.+?)["']?\s+(https?:\/\/[^\s]+)$/i);
        if (match3) {
            const name = match3[1].trim();
            // Исключаем случаи, где "название" это просто номер
            if (!/^[\d.]+$/.test(name) && name.length > 0) {
                items.push({
                    name: name,
                    link: match3[2].trim()
                });
                return;
            }
        }
        
        // Паттерн 4: "1. ссылка" (только ссылка с номером)
        const match4 = trimmedLine.match(/^[\d.]+\s+(https?:\/\/[^\s]+)/);
        if (match4) {
            items.push({
                link: match4[1].trim()
            });
            return;
        }
        
        // Паттерн 5: просто ссылка
        if (/^https?:\/\//.test(trimmedLine)) {
            items.push({
                link: trimmedLine
            });
        }
    });
    
    return items;
};

export const extractLinkOnlyItems = (section: string): EventItem[] => {
    const items: EventItem[] = [];
    const lines = section.split('\n').slice(1);
    
    lines.forEach(line => {
        const match = line.match(ITEM_PATTERNS.linkOnly);
        if (match) {
            items.push({ link: match[1].trim() });
        }
    });
    
    return items;
};

// НОВАЯ ФУНКЦИЯ: Извлечение выговоров с улучшенным распознаванием
export const extractWarnings = (section: string): Warning[] => {
    const warnings: Warning[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === '-' || /^7\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки
        if (trimmedLine.toLowerCase().includes('список выданных') || 
            (trimmedLine.toLowerCase().includes('выговор') && trimmedLine.toLowerCase().includes('причин'))) {
            return;
        }
        
        // Паттерн 1: "Nick_Name, получает дисциплинарное взыскание ... за нарушение пункта X"
        const match1 = trimmedLine.match(/^([\w_]+),?\s+получает.*?за\s+нарушение\s+(.+)$/i);
        if (match1) {
            warnings.push({
                nickname: match1[1].trim(),
                reason: match1[2].trim()
            });
            return;
        }
        
        // Паттерн 2: "Дата Nick_Name получает ... за нарушение ..."
        const match2 = trimmedLine.match(/^\d{2}\.\d{2}\.\d{2,4}\s+([\w_]+)\s+получает.*?за\s+(.+)$/i);
        if (match2) {
            warnings.push({
                nickname: match2[1].trim(),
                reason: match2[2].trim()
            });
            return;
        }
        
        // Паттерн 3: "Nick_Name - причина" (универсальный)
        const match3 = trimmedLine.match(/^([\w_]+)\s*-\s*(.+)$/);
        if (match3) {
            const nickname = match3[1].trim();
            const reason = match3[2].trim();
            
            // Дополнительная проверка, что это похоже на никнейм
            if (/^[A-Z][a-z]+_[A-Z][a-z]+/.test(nickname)) {
                warnings.push({
                    nickname: nickname,
                    reason: reason
                });
            }
        }
    });
    
    return warnings;
};

// УЛУЧШЕННАЯ ФУНКЦИЯ: Извлечение оценок с более гибким паттерном
export const extractEvaluations = (section: string): StaffEvaluation[] => {
    const evaluations: StaffEvaluation[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || /^13\)/.test(trimmedLine) || /^12\)/.test(trimmedLine) || /^14\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки
        if (trimmedLine.toLowerCase().includes('краткая оценка') || 
            trimmedLine.toLowerCase().includes('построени')) {
            return;
        }
        
        // Паттерн 1: "**Nick_Name** - 9/10 комментарий" (с markdown)
        const match1 = trimmedLine.match(/^\*\*(.+?)\*\*\s*-+\s*(\d+\/\d+)[,\s]+(.+)$/);
        if (match1) {
            evaluations.push({
                nickname: match1[1].trim(),
                rating: match1[2].trim(),
                comment: match1[3].trim()
            });
            return;
        }
        
        // Паттерн 2: "Nick_Name - 9/10 комментарий"
        const match2 = trimmedLine.match(/^([\w_]+)\s*-+\s*(\d+\/\d+)[,\s]+(.+)$/);
        if (match2) {
            evaluations.push({
                nickname: match2[1].trim(),
                rating: match2[2].trim(),
                comment: match2[3].trim()
            });
            return;
        }
        
        // Паттерн 3: "Nick_Name -- комментарий" (без оценки, для случаев типа "отпуск")
        const match3 = trimmedLine.match(/^([\w_]+)\s*-+\s*(.+)$/);
        if (match3 && !match3[2].includes('http')) {
            const nickname = match3[1].trim();
            const comment = match3[2].trim();
            
            if (/^[A-Z][a-z]+_[A-Z][a-z]+/.test(nickname)) {
                evaluations.push({
                    nickname: nickname,
                    rating: '-',
                    comment: comment
                });
            }
        }
    });
    
    return evaluations;
};

export const extractStaffChanges = (text: string): string => {
    const staffChangesSection = text.match(SECTION_PATTERNS.staffChanges);
    if (staffChangesSection) {
        const lines = staffChangesSection[0].split('\n').slice(1);
        const content = lines
            .filter(line => {
                const trimmed = line.trim();
                return trimmed && trimmed !== '-';
            })
            .join('\n')
            .trim();
        
        return content;
    }
    return '';
};

export const extractCallsData = (text: string): { callsPerWeek: number; callsAccepted: number } => {
    const callsSection = text.match(SECTION_PATTERNS.calls);
    if (callsSection) {
        return {
            callsPerWeek: extractNumber(callsSection[0], FIELD_PATTERNS.callsPerWeek),
            callsAccepted: extractNumber(callsSection[0], FIELD_PATTERNS.callsAccepted)
        };
    }
    return { callsPerWeek: 0, callsAccepted: 0 };
};

// НОВАЯ ФУНКЦИЯ: Извлечение остатка фонда с учетом "к" (тысяч)
export const extractFundBalance = (text: string): string => {
    const fundSection = text.match(SECTION_PATTERNS.fund);
    if (fundSection) {
        const match = fundSection[0].match(/Остаток\s*-+\s*(\d+к?)/i);
        if (match) {
            return match[1].trim();
        }
    }
    return '';
};

export const createEmptyParsedData = (): ParsedData => ({
    interviews: [],
    firedPSJ: 0,
    firedOCS: 0,
    totalFired: 0,
    totalHired: 0,
    firstRanks: '',
    middleStaff: '',
    seniorStaff: '',
    managementStaff: '',
    totalStaff: '',
    callsPerWeek: 0,
    callsAccepted: 0,
    staffChanges: '',
    warnings: [],
    fundReceived: 0,
    fundPaid: 0,
    fundBalance: '',
    lectures: [],
    trainings: [],
    events: [],
    interfactionEvents: [],
    staffEvaluations: []
});

export const parseLeaderReport = (text: any): ParsedData => {
    const data = createEmptyParsedData();
    
    const textStr = typeof text === 'string' ? text : '';
    
    // Собеседования
    data.interviews = extractInterviews(textStr);

    // Принятые/Уволенные
    data.totalHired = extractNumber(textStr, FIELD_PATTERNS.totalHired);
    data.firedPSJ = extractNumber(textStr, FIELD_PATTERNS.firedPSJ);
    data.firedOCS = extractNumber(textStr, FIELD_PATTERNS.firedOCS);
    data.totalFired = extractNumber(textStr, FIELD_PATTERNS.totalFired);

    // Количество сотрудников
    data.firstRanks = extractString(textStr, FIELD_PATTERNS.firstRanks);
    data.middleStaff = extractString(textStr, FIELD_PATTERNS.middleStaff);
    data.seniorStaff = extractString(textStr, FIELD_PATTERNS.seniorStaff);
    data.managementStaff = extractString(textStr, FIELD_PATTERNS.managementStaff);
    data.totalStaff = extractString(textStr, FIELD_PATTERNS.totalStaff);

    // Обзвоны
    const callsData = extractCallsData(textStr);
    data.callsPerWeek = callsData.callsPerWeek;
    data.callsAccepted = callsData.callsAccepted;

    // Кадровые перестановки
    data.staffChanges = extractStaffChanges(textStr);

    // Выговоры - УЛУЧШЕНО
    const warningsSection = textStr.match(SECTION_PATTERNS.warnings);
    if (warningsSection) {
        data.warnings = extractWarnings(warningsSection[0]);
    }

    // Фонд неустоек - УЛУЧШЕНО
    data.fundReceived = extractNumber(textStr, FIELD_PATTERNS.fundReceived);
    data.fundPaid = extractNumber(textStr, FIELD_PATTERNS.fundPaid);
    data.fundBalance = extractFundBalance(textStr);

    // Получаем весь пункт 9
    const allEventsSection = textStr.match(SECTION_PATTERNS.allEvents);
    
    if (allEventsSection) {
        const section9Text = allEventsSection[0];
        
        // Извлекаем лекции - все строки с "Лекция"
        const lectureLines = section9Text.split('\n').filter(line => 
            /Лекция/i.test(line) && /https?:\/\//.test(line)
        );
        lectureLines.forEach(line => {
            const extracted = extractEventItems(line);
            data.lectures.push(...extracted);
        });
        
        // Извлекаем тренировки - все строки с "Тренировка"
        const trainingLines = section9Text.split('\n').filter(line => 
            /Тренировка/i.test(line) && /https?:\/\//.test(line)
        );
        trainingLines.forEach(line => {
            const extracted = extractEventItems(line);
            data.trainings.push(...extracted);
        });
        
        // Извлекаем мероприятия - все строки с "Мероприятие"
        const eventLines = section9Text.split('\n').filter(line => 
            /Мероприятие/i.test(line) && /https?:\/\//.test(line)
        );
        eventLines.forEach(line => {
            const extracted = extractEventItems(line);
            data.events.push(...extracted);
        });
    }

    // Мероприятия от филиалов (пункт 10)
    const branchEventsSection = textStr.match(SECTION_PATTERNS.branchEvents);
    if (branchEventsSection) {
        const branchLinks = extractLinks(branchEventsSection[0]);
        branchLinks.forEach(link => {
            // Проверяем, что ссылка уже не добавлена в events
            if (!data.events.some(e => e.link === link.trim())) {
                data.events.push({ 
                    name: 'Мероприятие от филиала', 
                    link: link.trim() 
                });
            }
        });
    }

    // Межфракционные мероприятия (пункт 11) - УЛУЧШЕНО
    const interfactionSection = textStr.match(SECTION_PATTERNS.interfaction);
    if (interfactionSection) {
        const interfactionLinks = extractLinks(interfactionSection[0]);
        interfactionLinks.forEach(link => {
            data.interfactionEvents.push({ link: link.trim() });
        });
    }

    // Оценка старшего состава (пункт 12 или 13) - УЛУЧШЕНО
    const evaluationsSection = textStr.match(SECTION_PATTERNS.evaluations);
    if (evaluationsSection) {
        data.staffEvaluations = extractEvaluations(evaluationsSection[0]);
    }

    return data;
};