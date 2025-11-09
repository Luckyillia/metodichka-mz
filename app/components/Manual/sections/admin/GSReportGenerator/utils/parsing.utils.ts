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
    return match ? match[1] : '';
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

export const extractEventItems = (section: string): EventItem[] => {
    const items: EventItem[] = [];
    const lines = section.split('\n').slice(1);
    
    lines.forEach(line => {
        const match = line.match(ITEM_PATTERNS.eventItem);
        if (match) {
            items.push({
                name: match[1].trim(),
                link: match[2].trim()
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

export const extractWarnings = (section: string): Warning[] => {
    const warnings: Warning[] = [];
    const lines = section.split('\n').slice(1);
    
    lines.forEach(line => {
        const match = line.match(ITEM_PATTERNS.warning);
        if (match) {
            warnings.push({
                nickname: match[1].trim(),
                reason: match[2].trim()
            });
        }
    });
    
    return warnings;
};

export const extractEvaluations = (section: string): StaffEvaluation[] => {
    const evaluations: StaffEvaluation[] = [];
    const lines = section.split('\n').slice(1);
    
    lines.forEach(line => {
        const match = line.match(ITEM_PATTERNS.evaluation);
        if (match) {
            evaluations.push({
                nickname: match[1].trim(),
                rating: match[2].trim(),
                comment: match[3].trim()
            });
        }
    });
    
    return evaluations;
};

export const extractStaffChanges = (text: string): string => {
    const staffChangesSection = text.match(SECTION_PATTERNS.staffChanges);
    if (staffChangesSection) {
        const content = staffChangesSection[0].split('\n').slice(1).join('\n').trim();
        if (content && content !== '-') {
            return content;
        }
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
    
    // Ensure text is a string
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
    const warningsSection = textStr.match(SECTION_PATTERNS.warnings);
    if (warningsSection) {
        data.warnings = extractWarnings(warningsSection[0]);
    }

    // Фонд неустоек
    data.fundReceived = extractNumber(textStr, FIELD_PATTERNS.fundReceived);
    data.fundPaid = extractNumber(textStr, FIELD_PATTERNS.fundPaid);
    data.fundBalance = extractString(textStr, FIELD_PATTERNS.fundBalance);

    // Лекции
    const lecturesSection = textStr.match(SECTION_PATTERNS.lectures);
    if (lecturesSection) {
        data.lectures = extractEventItems(lecturesSection[0]);
    }

    // Тренировки
    const trainingsSection = textStr.match(SECTION_PATTERNS.trainings);
    if (trainingsSection) {
        data.trainings = extractEventItems(trainingsSection[0]);
    }

    // Мероприятия
    const eventsSection = textStr.match(SECTION_PATTERNS.events);
    if (eventsSection) {
        data.events = extractEventItems(eventsSection[0]);
    }

    // Мероприятия от филиалов
    const branchEventsSection = textStr.match(SECTION_PATTERNS.branchEvents);
    if (branchEventsSection) {
        extractLinkOnlyItems(branchEventsSection[0]).forEach(item => {
            if (!data.events.some(e => e.link === item.link)) {
                data.events.push({ name: 'Мероприятие от филиала', link: item.link });
            }
        });
    }

    // Межфракционные мероприятия
    const interfactionSection = textStr.match(SECTION_PATTERNS.interfaction);
    if (interfactionSection) {
        data.interfactionEvents = extractLinkOnlyItems(interfactionSection[0]);
    }

    // Оценка старшего состава
    const evaluationsSection = textStr.match(SECTION_PATTERNS.evaluations);
    if (evaluationsSection) {
        data.staffEvaluations = extractEvaluations(evaluationsSection[0]);
    }

    return data;
};