import { generateReport } from '../utils';
import { CityData } from '../types';

export const useReportGeneration = () => {
    const copyReport = (
        gsNickname: string,
        organization: string,
        dateFrom: string,
        dateTo: string,
        cities: CityData[],
        grpEvents: string,
        generalInfo: string
    ) => {
        const report = generateReport(
            gsNickname,
            organization,
            dateFrom,
            dateTo,
            cities,
            grpEvents,
            generalInfo
        );
        navigator.clipboard.writeText(report);
        alert('Отчет ГС скопирован в буфер обмена!');
    };

    return { copyReport };
};