import { ParsedData } from './report.types';

export interface CityData {
    name: string;
    leaderReports: string[];
    parsedData: ParsedData;
    leaderAppointment: string;
    leaderBans: string;
    leaderWarnings: string;
    leaderRemoval: string;
    leaderEvaluation: string;
}

export type ItemType = 'link' | 'nameLink' | 'warning';