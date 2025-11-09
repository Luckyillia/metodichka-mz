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
        console.log('parseAndMergeLeaderReport started:', {
            cityIndex,
            reportIndex,
            textLength: text.length,
            citiesLength: cities.length
        });

        try {
            const newCities = [...cities];
            
            console.log('Parsing report...');
            const parsedData = parseLeaderReport(text);
            console.log('Parsed data:', parsedData);
            
            console.log('Current parsed data before merge:', newCities[cityIndex].parsedData);
            
            newCities[cityIndex].parsedData = mergeData(
                newCities[cityIndex].parsedData,
                parsedData
            );
            
            console.log('Merged data:', newCities[cityIndex].parsedData);
            
            newCities[cityIndex].leaderReports[reportIndex] = text;
            
            console.log('Setting new cities state');
            setCities(newCities);
            console.log('State updated successfully');
        } catch (error) {
            console.error('Error in parseAndMergeLeaderReport:', error);
        }
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