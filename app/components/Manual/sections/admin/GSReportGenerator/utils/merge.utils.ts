import { ParsedData, StaffEvaluation } from '../types';

export const deduplicateByLink = <T extends { link: string }>(items: T[]): T[] => {
    return items.filter((item, index, self) => 
        index === self.findIndex(t => t.link === item.link)
    );
};

export const mergeEvaluations = (
    existing: StaffEvaluation[], 
    incoming: StaffEvaluation[]
): StaffEvaluation[] => {
    const combined = [...existing];
    
    incoming.forEach(newEval => {
        const existingIndex = combined.findIndex(e => e.nickname === newEval.nickname);
        if (existingIndex >= 0) {
            combined[existingIndex] = newEval;
        } else {
            combined.push(newEval);
        }
    });
    
    return combined;
};

export const mergeData = (existing: ParsedData, incoming: ParsedData): ParsedData => ({
    interviews: deduplicateByLink([...existing.interviews, ...incoming.interviews]),
    firedPSJ: existing.firedPSJ + incoming.firedPSJ,
    firedOCS: existing.firedOCS + incoming.firedOCS,
    totalFired: existing.totalFired + incoming.totalFired,
    totalHired: existing.totalHired + incoming.totalHired,
    firstRanks: incoming.firstRanks || existing.firstRanks,
    middleStaff: incoming.middleStaff || existing.middleStaff,
    seniorStaff: incoming.seniorStaff || existing.seniorStaff,
    managementStaff: incoming.managementStaff || existing.managementStaff,
    totalStaff: incoming.totalStaff || existing.totalStaff,
    callsPerWeek: existing.callsPerWeek + incoming.callsPerWeek,
    callsAccepted: existing.callsAccepted + incoming.callsAccepted,
    staffChanges: [existing.staffChanges, incoming.staffChanges].filter(Boolean).join('\n'),
    warnings: [...existing.warnings, ...incoming.warnings],
    fundReceived: existing.fundReceived + incoming.fundReceived,
    fundPaid: existing.fundPaid + incoming.fundPaid,
    fundBalance: incoming.fundBalance || existing.fundBalance,
    lectures: deduplicateByLink([...existing.lectures, ...(incoming.lectures || [])]),
    trainings: deduplicateByLink([...(existing.trainings || []), ...(incoming.trainings || [])]),
    events: deduplicateByLink([...existing.events, ...(incoming.events || [])]),
    interfactionEvents: deduplicateByLink([...existing.interfactionEvents, ...(incoming.interfactionEvents || [])]),
    staffEvaluations: mergeEvaluations(existing.staffEvaluations, incoming.staffEvaluations)
});