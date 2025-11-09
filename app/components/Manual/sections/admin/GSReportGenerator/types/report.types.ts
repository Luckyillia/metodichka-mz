export interface Interview {
    link: string;
}

export interface Warning {
    nickname: string;
    reason: string;
}

export interface EventItem {
    name?: string;
    link: string;
}

export interface StaffEvaluation {
    nickname: string;
    rating: string;
    comment: string;
}

export interface ParsedData {
    interviews: Interview[];
    firedPSJ: number;
    firedOCS: number;
    totalFired: number;
    totalHired: number;
    firstRanks: string;
    middleStaff: string;
    seniorStaff: string;
    managementStaff: string;
    totalStaff: string;
    callsPerWeek: number;
    callsAccepted: number;
    staffChanges: string;
    warnings: Warning[];
    fundReceived: number;
    fundPaid: number;
    fundBalance: string;
    lectures: EventItem[];
    trainings: EventItem[];
    events: EventItem[];
    interfactionEvents: EventItem[];
    staffEvaluations: StaffEvaluation[];
}