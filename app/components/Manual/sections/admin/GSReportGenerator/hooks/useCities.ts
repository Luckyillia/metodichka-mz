import { useState } from 'react';
import { CityData } from '../types';
import { createEmptyParsedData } from '../utils';
import { DEFAULT_CITY_NAMES } from '../constants';

const createEmptyCity = (name: string = ''): CityData => ({
    name,
    leaderReports: [''],
    parsedData: createEmptyParsedData(),
    leaderAppointment: '',
    leaderBans: '',
    leaderWarnings: '',
    leaderRemoval: '',
    leaderEvaluation: ''
});

export const useCities = () => {
    const [cities, setCities] = useState<CityData[]>([
        createEmptyCity(DEFAULT_CITY_NAMES[0]),
        createEmptyCity(DEFAULT_CITY_NAMES[1]),
        createEmptyCity(DEFAULT_CITY_NAMES[2])
    ]);

    // const addCity = () => {
    //     setCities([...cities, createEmptyCity()]);
    // };

    const removeCity = (index: number) => {
        if (cities.length === 1) return;
        const newCities = [...cities];
        newCities.splice(index, 1);
        setCities(newCities);
    };

    const updateCity = (cityIndex: number, field: keyof CityData, value: any) => {
        const newCities = [...cities];
        newCities[cityIndex] = {
            ...newCities[cityIndex],
            [field]: value
        };
        setCities(newCities);
    };

    const updateParsedData = (cityIndex: number, field: string, value: any) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData = {
            ...newCities[cityIndex].parsedData,
            [field]: value
        };
        setCities(newCities);
    };

    const clearCityData = (cityIndex: number) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData = createEmptyParsedData();
        newCities[cityIndex].leaderReports = [''];
        setCities(newCities);
    };

    return {
        cities,
        setCities,
        //addCity,
        removeCity,
        updateCity,
        updateParsedData,
        clearCityData
    };
};