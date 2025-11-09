import { parseLeaderReport, mergeData } from '../utils';
import { CityData } from '../types';

export const useLeaderReports = (
    cities: CityData[],
    setCities: (cities: CityData[]) => void
) => {
    const parseAndMergeLeaderReport = (
        text: string,
        cityIndex: number,
        reportIndex: number
    ) => {
        const newCities = [...cities];
        const parsedData = parseLeaderReport(text);
        newCities[cityIndex].parsedData = mergeData(
            newCities[cityIndex].parsedData,
            parsedData
        );
        newCities[cityIndex].leaderReports[reportIndex] = text;
        setCities(newCities);
    };

    const addLeaderReportField = (cityIndex: number) => {
        const newCities = [...cities];
        newCities[cityIndex].leaderReports.push('');
        setCities(newCities);
    };

    const removeLeaderReportField = (cityIndex: number, reportIndex: number) => {
        const newCities = [...cities];
        if (newCities[cityIndex].leaderReports.length > 1) {
            newCities[cityIndex].leaderReports.splice(reportIndex, 1);
        }
        setCities(newCities);
    };

    const unlockLeaderReport = (cityIndex: number, reportIndex: number) => {
        const newCities = [...cities];
        newCities[cityIndex].leaderReports[reportIndex] = '';
        setCities(newCities);
    };

    return {
        parseAndMergeLeaderReport,
        addLeaderReportField,
        removeLeaderReportField,
        unlockLeaderReport
    };
};