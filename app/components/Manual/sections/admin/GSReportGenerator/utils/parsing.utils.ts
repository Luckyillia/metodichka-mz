// ================================
// ФАЙЛ: src/utils/parsing.utils.ts
// УНИВЕРСАЛЬНЫЙ ПАРСЕР (поддерживает любые форматы)
// ================================

import { SECTION_PATTERNS, FIELD_PATTERNS, ITEM_PATTERNS } from '../constants';
import type { 
    ParsedData, 
    EventItem, 
    Warning, 
    StaffEvaluation,
    Interview 
} from '../types';

// ================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ================================

// Функция для поиска секции по массиву паттернов
const findSection = (text: string, patterns: readonly RegExp[]): RegExpMatchArray | null => {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match;
    }
    return null;
};

// Функция для извлечения числа по массиву паттернов
const extractNumberMulti = (text: string, patterns: readonly RegExp[]): number => {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            // Убираем пробелы из числа (например, "100 000" -> "100000")
            const cleanedNumber = match[1].replace(/\s+/g, '');
            return parseInt(cleanedNumber) || 0;
        }
    }
    return 0;
};

export const extractNumber = (text: string, pattern: RegExp | readonly RegExp[]): number => {
    if (Array.isArray(pattern)) {
        return extractNumberMulti(text, pattern);
    }
    return extractNumberMulti(text, [pattern] as RegExp[]);
};

// Функция для извлечения строки по массиву паттернов
const extractStringMulti = (text: string, patterns: readonly RegExp[]): string => {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return match[1].trim();
    }
    return '';
};

export const extractString = (text: string, pattern: RegExp | readonly RegExp[]): string => {
    if (Array.isArray(pattern)) {
        return extractStringMulti(text, pattern);
    }
    return extractStringMulti(text, [pattern] as RegExp[]);
};

export const extractLinks = (text: string): string[] => {
    return text.match(ITEM_PATTERNS.link) || [];
};

// Функция для очистки ссылок от markdown и лишних символов
const cleanLink = (link: string): string => {
    // Убираем markdown: [текст](ссылка) -> ссылка
    link = link.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
    // Убираем обратные слэши
    link = link.replace(/\\/g, '');
    // Убираем markdown подчеркивание: [ссылка]{.underline} -> ссылка
    link = link.replace(/\[([^\]]+)\]\{[^}]+\}/g, '$1');
    return link.trim();
};

// Функция для очистки текста от markdown
const cleanText = (text: string): string => {
    // Убираем жирный текст: **текст** -> текст
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    // Убираем курсив: *текст* -> текст
    text = text.replace(/\*([^*]+)\*/g, '$1');
    // Убираем markdown пометки: {.mark} и т.д.
    text = text.replace(/\{[^}]+\}/g, '');
    // Убираем лишние пробелы
    text = text.replace(/\s+/g, ' ');
    return text.trim();
};

// ================================
// ИЗВЛЕЧЕНИЕ СОБЕСЕДОВАНИЙ
// ================================

export const extractInterviews = (text: string): Interview[] => {
    const interviews: Interview[] = [];
    const interviewsSection = findSection(text, SECTION_PATTERNS.interviews);
    
    if (interviewsSection) {
        extractLinks(interviewsSection[0]).forEach(link => {
            interviews.push({ link: cleanLink(link) });
        });
    }
    
    return interviews;
};

// ================================
// ИЗВЛЕЧЕНИЕ СОБЫТИЙ (Лекции, Тренировки, Мероприятия)
// ================================

export const extractEventItems = (section: string): EventItem[] => {
    const items: EventItem[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        let trimmedLine = cleanText(line.trim());
        if (!trimmedLine || trimmedLine === '-' || /^\d+\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки секций
        if (/^(Лекции:|Тренировки:|Мероприятия:|МП:|Проведение)/i.test(trimmedLine)) return;
        
        // Ищем ссылку в строке
        const linkMatch = trimmedLine.match(/https?:\/\/[^\s\]]+/);
        if (!linkMatch) return;
        
        const link = cleanLink(linkMatch[0]);
        
        // Паттерн 1: "Лекция "Название" - ссылка" или "1. Лекция "Название" - ссылка"
        const match1 = trimmedLine.match(/^(?:\d+\.?\d*\.?\s*)?(?:Лекция|Тренировка|Мероприятие)\s+["']([^"']+)["']\s*[-:]/i);
        if (match1) {
            items.push({
                name: cleanText(match1[1]),
                link: link
            });
            return;
        }
        
        // Паттерн 2: "1.1. Лекция Название https://..." (с точкой и пробелом перед ссылкой)
        const match2 = trimmedLine.match(/^(?:\d+\.?\d*\.?\s*)?(?:Лекция|Тренировка|Мероприятие[а-я]*)\s+([^\-:]+?)\s+https?/i);
        if (match2) {
            const name = cleanText(match2[1]);
            if (name.length > 0 && !/^\d+\.?$/.test(name)) {
                items.push({
                    name: name,
                    link: link
                });
                return;
            }
        }
        
        // Паттерн 3: "Лекция Название - ссылка" (с тире)
        const match3 = trimmedLine.match(/^(?:\d+\.?\d*\.?\s*)?(?:Лекция|Тренировка|Мероприятие[а-я]*)\s+([^-:]+?)\s*[-:]\s*https?/i);
        if (match3) {
            const name = cleanText(match3[1]);
            if (name.length > 0 && !/^\d+\.?$/.test(name)) {
                items.push({
                    name: name,
                    link: link
                });
                return;
            }
        }
        
        // Паттерн 4: "2.3 Название https://..." (нумерация + название + пробел + ссылка)
        const match4 = trimmedLine.match(/^(\d+\.?\d*\.?\s+)([^\s]+(?:\s+[^\s]+)*?)\s+https?/i);
        if (match4) {
            let name = cleanText(match4[2]);
            // Убираем префиксы "Лекция", "Тренировка", "Мероприятие", "Мероприятия" если они есть
            name = name.replace(/^(?:Лекция|Лекции|Тренировка|Тренировки|Мероприятие|Мероприятия)\s*/i, '');
            if (name.length > 0 && !/^\d+\.?$/.test(name)) {
                items.push({
                    name: name,
                    link: link
                });
                return;
            }
        }
        
        // Паттерн 5: "Название - ссылка" (без префикса и нумерации)
        const match5 = trimmedLine.match(/^([^-:]+?)\s*-+\s*https?/i);
        if (match5) {
            let name = cleanText(match5[1]);
            // Убираем префиксы "Лекция", "Тренировка", "Мероприятие" если они есть
            name = name.replace(/^(?:Лекция|Тренировка|Мероприятие)\s*/i, '');
            if (name.length > 0 && !/^\d+\.?$/.test(name)) {
                items.push({
                    name: name,
                    link: link
                });
                return;
            }
        }
        
        // Паттерн 6: "Название: ссылка"
        const match6 = trimmedLine.match(/^(?:\d+\.?\s*)?(?:Лекция|Тренировка|Мероприятие)?\s*["']?([^"':]+?)["']?\s*:\s*https?/i);
        if (match6) {
            items.push({
                name: cleanText(match6[1]),
                link: link
            });
            return;
        }
        
        // Паттерн 7: только ссылка (без названия)
        items.push({
            link: link
        });
    });
    
    return items;
};

export const extractLinkOnlyItems = (section: string): EventItem[] => {
    const items: EventItem[] = [];
    const lines = section.split('\n').slice(1);
    
    lines.forEach(line => {
        const match = line.match(ITEM_PATTERNS.linkOnly);
        if (match) {
            items.push({ link: cleanLink(match[1]) });
        }
    });
    
    return items;
};

// ================================
// ИЗВЛЕЧЕНИЕ ВЫГОВОРОВ
// ================================

export const extractWarnings = (section: string): Warning[] => {
    const warnings: Warning[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        let trimmedLine = cleanText(line.trim());
        if (!trimmedLine || trimmedLine === '-' || /^7\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки
        if (trimmedLine.toLowerCase().includes('список выданных') || 
            (trimmedLine.toLowerCase().includes('выговор') && trimmedLine.toLowerCase().includes('причин'))) {
            return;
        }
        
        // Проверяем наличие никнейма (формат Nick_Name)
        const nicknameMatch = trimmedLine.match(/^(?:\d{2}\.\d{2}\.\d{2,4}\s+)?([\w_]+)\b/);
        if (!nicknameMatch) return;
        
        const nickname = nicknameMatch[1];
        // Проверяем, что это похоже на никнейм (содержит подчеркивание или начинается с заглавной)
        if (!/[A-Z]/.test(nickname[0]) && !nickname.includes('_')) return;
        
        // Паттерн 1: "Nick_Name объявлен выговор за нарушение..."
        const match1 = trimmedLine.match(/^([\w_]+)\s+объявлен\s+выговор\s+за\s+нарушение\s+(.+)$/i);
        if (match1) {
            warnings.push({
                nickname: match1[1],
                reason: match1[2].trim()
            });
            return;
        }
        
        // Паттерн 2: "Nick_Name получает письменное дисциплинарное взыскание в виде выговора за нарушение пункта..."
        const match2 = trimmedLine.match(/^([\w_]+)\s+получает.*?выговора?\s+за\s+нарушение\s+(?:пункта\s+)?(.+)$/i);
        if (match2) {
            warnings.push({
                nickname: match2[1],
                reason: match2[2].trim()
            });
            return;
        }
        
        // Паттерн 3: "Nick_Name – 4.38 ПСГО – 1" (с тире или дефисом)
        const match3 = trimmedLine.match(/^(?:\d{2}\.\d{2}\.\d{2,4}\s+)?([\w_]+)\s*[-–]+\s*(.+?)\s*[-–]+\s*(\d+)/);
        if (match3) {
            warnings.push({
                nickname: match3[1],
                reason: `${match3[2].trim()} (количество: ${match3[3]})`
            });
            return;
        }
        
        // Паттерн 4: "Nick_Name – 4.38 ПСГО" (без количества)
        const match4 = trimmedLine.match(/^(?:\d{2}\.\d{2}\.\d{2,4}\s+)?([\w_]+)\s*[-–]+\s*([^-–]+)$/);
        if (match4) {
            let reason = match4[2].trim();
            // Убираем точку в конце, если есть
            reason = reason.replace(/\.$/, '');
            warnings.push({
                nickname: match4[1],
                reason: reason
            });
            return;
        }
    });
    
    return warnings;
};

// ================================
// ИЗВЛЕЧЕНИЕ ОЦЕНОК СОТРУДНИКОВ
// ================================

export const extractEvaluations = (section: string): StaffEvaluation[] => {
    const evaluations: StaffEvaluation[] = [];
    const lines = section.split('\n');
    
    lines.forEach(line => {
        let trimmedLine = cleanText(line.trim());
        if (!trimmedLine || /^13\)/.test(trimmedLine) || /^12\)/.test(trimmedLine) || /^14\)/.test(trimmedLine)) return;
        
        // Пропускаем заголовки
        if (trimmedLine.toLowerCase().includes('краткая оценка') || 
            trimmedLine.toLowerCase().includes('построени')) {
            return;
        }
        
        // Проверяем наличие никнейма
        const nicknameMatch = trimmedLine.match(/^([\w_]+)\b/);
        if (!nicknameMatch) return;
        
        const nickname = nicknameMatch[1];
        // Проверяем, что это похоже на никнейм
        if (!/^[A-Z]/.test(nickname) && !nickname.includes('_')) return;
        
        // Паттерн 1: "Nick_Name – 9/10 – комментарий" (с тире или дефисом)
        const match1 = trimmedLine.match(/^([\w_]+)\s*[-–]+\s*(\d+\/\d+)\s*[-–,]?\s*(.+)$/);
        if (match1) {
            evaluations.push({
                nickname: match1[1],
                rating: match1[2],
                comment: match1[3].trim()
            });
            return;
        }
        
        // Паттерн 2: "Nick_Name - 9/10 комментарий" (без разделителя между рейтингом и комментарием)
        const match2 = trimmedLine.match(/^([\w_]+)\s*[-–]+\s*(\d+\/\d+)\s+(.+)$/);
        if (match2) {
            evaluations.push({
                nickname: match2[1],
                rating: match2[2],
                comment: match2[3].trim()
            });
            return;
        }
        
        // Паттерн 3: "Nick_Name - комментарий" (без оценки)
        const match3 = trimmedLine.match(/^([\w_]+)\s*[-–]+\s*(.+)$/);
        if (match3 && !match3[2].includes('http')) {
            const comment = match3[2].trim();
            // Проверяем, что это не ссылка и не выговор
            if (!comment.includes('ПСГО') && comment.length > 5) {
                evaluations.push({
                    nickname: match3[1],
                    rating: '-',
                    comment: comment
                });
            }
        }
    });
    
    return evaluations;
};

// ================================
// ИЗВЛЕЧЕНИЕ КАДРОВЫХ ПЕРЕСТАНОВОК
// ================================

export const extractStaffChanges = (text: string): string => {
    const staffChangesSection = findSection(text, SECTION_PATTERNS.staffChanges);
    if (staffChangesSection) {
        const lines = staffChangesSection[0].split('\n').slice(1);
        const content = lines
            .filter(line => {
                const trimmed = line.trim();
                return trimmed && trimmed !== '';
            })
            .map(line => cleanText(line))
            .join('\n')
            .trim();
        
        // Если содержимое - только "-", возвращаем его
        if (content === '-') return '-';
        
        return content;
    }
    return '';
};

// ================================
// ИЗВЛЕЧЕНИЕ ДАННЫХ ОБ ОБЗВОНАХ
// ================================

export const extractCallsData = (text: string): { callsPerWeek: number; callsAccepted: number } => {
    const callsSection = findSection(text, SECTION_PATTERNS.calls);
    if (callsSection) {
        return {
            callsPerWeek: extractNumber(callsSection[0], FIELD_PATTERNS.callsPerWeek),
            callsAccepted: extractNumber(callsSection[0], FIELD_PATTERNS.callsAccepted)
        };
    }
    return { callsPerWeek: 0, callsAccepted: 0 };
};

// ================================
// ИЗВЛЕЧЕНИЕ ОСТАТКА ФОНДА
// ================================

export const extractFundBalance = (text: string): string => {
    const fundSection = findSection(text, SECTION_PATTERNS.fund);
    if (fundSection) {
        const match = fundSection[0].match(/Остаток\s*[-–]+\s*([\d\s]+к?)/i);
        if (match) {
            return match[1].trim();
        }
    }
    return '';
};

// ================================
// СОЗДАНИЕ ПУСТОЙ СТРУКТУРЫ ДАННЫХ
// ================================

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

// ================================
// ГЛАВНАЯ ФУНКЦИЯ ПАРСИНГА
// ================================

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

    // Выговоры
    const warningsSection = findSection(textStr, SECTION_PATTERNS.warnings);
    if (warningsSection) {
        data.warnings = extractWarnings(warningsSection[0]);
    }

    // Фонд неустоек
    data.fundReceived = extractNumber(textStr, FIELD_PATTERNS.fundReceived);
    data.fundPaid = extractNumber(textStr, FIELD_PATTERNS.fundPaid);
    data.fundBalance = extractFundBalance(textStr);

    // Лекции, тренировки, мероприятия (пункт 9)
    const allEventsSection = findSection(textStr, SECTION_PATTERNS.allEvents);
    
    if (allEventsSection) {
        const section9Text = allEventsSection[0];
        
        // Пробуем разные варианты разделения на подсекции
        
        // Вариант 1: Есть явные подзаголовки "Лекции:", "Тренировки:", "Мероприятия:", "МП:"
        // Ищем подзаголовки только если они стоят в начале строки (после переноса)
        const lecturesSectionMatch = section9Text.match(/\n\s*Лекции:?\s*\n([\s\S]*?)(?=\n\s*(?:Тренировки:|Мероприятия:|МП:|Межфракционные)|10\)|$)/i);
        const trainingSectionMatch = section9Text.match(/\n\s*Тренировки:?\s*\n([\s\S]*?)(?=\n\s*(?:Лекции:|Мероприятия:|МП:|Межфракционные)|10\)|$)/i);
        const eventsSectionMatch = section9Text.match(/\n\s*(?:Мероприятия:|МП:)\s*\n([\s\S]*?)(?=\n\s*(?:Лекции:|Тренировки:|Межфракционные)|10\)|$)/i);
        
        // Проверяем, есть ли хотя бы один подзаголовок
        const hasSubsections = lecturesSectionMatch || trainingSectionMatch || eventsSectionMatch;
        
        // Извлекаем лекции
        if (lecturesSectionMatch && lecturesSectionMatch[1].trim()) {
            const lecturesText = lecturesSectionMatch[1];
            data.lectures = extractEventItems(lecturesText);
        }
        
        // Извлекаем тренировки
        if (trainingSectionMatch && trainingSectionMatch[1].trim()) {
            const trainingsText = trainingSectionMatch[1];
            data.trainings = extractEventItems(trainingsText);
        }
        
        // Извлекаем мероприятия (включая МП)
        if (eventsSectionMatch && eventsSectionMatch[1].trim()) {
            const eventsText = eventsSectionMatch[1];
            data.events = extractEventItems(eventsText);
        }
        
        // Извлекаем межфракционные мероприятия из секции 9 (если они там есть)
        const interfactionInSection9Match = section9Text.match(/\n\s*Межфракционные\s+мероприятия:?\s*\n([\s\S]*?)(?=10\)|$)/i);
        if (interfactionInSection9Match && interfactionInSection9Match[1].trim()) {
            const interfactionText = interfactionInSection9Match[1];
            const interfactionItems = extractEventItems(interfactionText);
            // Добавляем только ссылки (без названий) в interfactionEvents
            interfactionItems.forEach(item => {
                data.interfactionEvents.push({ link: item.link });
            });
        }
        
        // Вариант 2: Нет подзаголовков - пробуем определить по ключевым словам в строках
        if (!hasSubsections) {
            const lines = section9Text.split('\n');
            
            lines.forEach((line) => {
                const trimmedLine = cleanText(line.trim());
                if (!trimmedLine || trimmedLine.length < 5) return;
                
                // Пропускаем заголовок секции
                if (/^9[.)]\s*Проведение/i.test(trimmedLine)) return;
                
                // Проверяем наличие ссылки
                if (!/https?:\/\//.test(trimmedLine)) return;
                
                // Определяем тип по ключевым словам в начале строки
                // Проверяем, начинается ли строка с "Лекция" (после возможной нумерации)
                if (/^(?:\d+\.?\s*)?Лекция\s+/i.test(trimmedLine)) {
                    const extracted = extractEventItems(line);
                    data.lectures.push(...extracted);
                } 
                // Проверяем, начинается ли строка с "Тренировка" (после возможной нумерации)
                else if (/^(?:\d+\.?\s*)?Тренировка\s+/i.test(trimmedLine)) {
                    const extracted = extractEventItems(line);
                    data.trainings.push(...extracted);
                } 
                // Если слово "Лекция" или "Тренировка" встречается где-то в середине строки
                else if (/лекци/i.test(trimmedLine)) {
                    const extracted = extractEventItems(line);
                    data.lectures.push(...extracted);
                } else if (/тренировк/i.test(trimmedLine)) {
                    const extracted = extractEventItems(line);
                    data.trainings.push(...extracted);
                } else {
                    // Все остальное считаем мероприятиями
                    const extracted = extractEventItems(line);
                    data.events.push(...extracted);
                }
            });
        }
    }

    // Мероприятия от филиалов (пункт 10)
    const branchEventsSection = findSection(textStr, SECTION_PATTERNS.branchEvents);
    if (branchEventsSection) {
        const branchLinks = extractLinks(branchEventsSection[0]);
        branchLinks.forEach(link => {
            const cleanedLink = cleanLink(link);
            // Проверяем, что ссылка уже не добавлена в events
            if (!data.events.some(e => e.link === cleanedLink)) {
                data.events.push({ 
                    name: 'Мероприятие от филиала', 
                    link: cleanedLink
                });
            }
        });
    }

    // Межфракционные мероприятия (пункт 11)
    const interfactionSection = findSection(textStr, SECTION_PATTERNS.interfaction);
    if (interfactionSection) {
        const interfactionLinks = extractLinks(interfactionSection[0]);
        interfactionLinks.forEach(link => {
            data.interfactionEvents.push({ link: cleanLink(link) });
        });
    }

    // Оценка старшего состава (пункт 12 или 13)
    const evaluationsSection = findSection(textStr, SECTION_PATTERNS.evaluations);
    if (evaluationsSection) {
        data.staffEvaluations = extractEvaluations(evaluationsSection[0]);
    }

    return data;
};