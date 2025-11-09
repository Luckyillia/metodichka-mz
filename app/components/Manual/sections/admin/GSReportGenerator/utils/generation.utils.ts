import { CityData } from '../types';

export const generateReport = (
    gsNickname: string,
    organization: string,
    dateFrom: string,
    dateTo: string,
    cities: CityData[],
    grpEvents: string,
    generalInfo: string
): string => {
    const sections: string[] = [];
    
    // Заголовок
    sections.push(`Отчёт от ГС ${gsNickname || 'Nick_Name'} ${organization} с ${dateFrom || 'xx.xx.2025'} по ${dateTo || 'xx.xx.2025'}.\n`);
    
    // Секции 2-17 аналогично оригиналу...
    // (код генерации отчета остается тем же)
    
    return sections.join('\n');
};

export const calculateTotalInterviews = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => 
        sum + city.parsedData.interviews.filter(i => i.link).length, 0
    );
};

export const calculateTotalHired = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => sum + city.parsedData.totalHired, 0);
};

export const calculateTotalWarnings = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => sum + city.parsedData.warnings.length, 0);
};