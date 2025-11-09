import { generateReport, generateDocxReport } from '../utils';
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

    const downloadDocxReport = async (
        gsNickname: string,
        organization: string,
        dateFrom: string,
        dateTo: string,
        cities: CityData[],
        grpEvents: string,
        generalInfo: string
    ) => {
        try {
            await generateDocxReport(
                gsNickname,
                organization,
                dateFrom,
                dateTo,
                cities,
                grpEvents,
                generalInfo
            );
            alert('Отчет ГС успешно скачан!');
        } catch (error) {
            console.error('Ошибка при создании документа:', error);
            alert('Ошибка при создании документа. Попробуйте снова.');
        }
    };

    return { copyReport, downloadDocxReport };
};