import { useState } from 'react';
import { GlobalSettings, TabSettings } from '../types';

// Хук для управления настройками команд
export const useCommandSettings = () => {
    // Глобальные настройки
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
        doctorTag: 'ГВ',
        city: 'Мирный'
    });

    // Локальные настройки для каждой вкладки
    const [tabSettings, setTabSettings] = useState<TabSettings>({
        calls: {
            callNumber: '1',
            partnerName: ''
        },
        patrol: {
            partnerName: ''
        },
        posts: {
            selectedPost: '',
            partnerName: ''
        },
        departments: {
            fromDepartment: 'ОКБ-М',
            toDepartment: 'МВД',
            reason: 'неадекватные граждане',
            // Для запроса наряда МВД
            mvdDepartment: 'МВД',
            mvdLocation: 'здание ОКБ-М',
            mvdReason: 'неадекватные граждане',
            // Для разрешения на посадку
            landingDepartment: 'МЧС',
            landingReason: 'экстренная транспортировка пациента',
            // Для начала движения колонной
            columnDepartment: 'РЖД'
        },
        shift: {
            // Нет локальных настроек
        },
        binds: {
            gender: 'male',
            firstName: 'Имя',
            lastName: 'Фамилия',
            position: 'Должность'
        }
    });

    // Обработчик изменения глобальных настроек
    const handleGlobalSettingChange = (key: keyof GlobalSettings, value: string) => {
        setGlobalSettings(prev => {
            const newSettings = { ...prev, [key]: value };

            // Если изменился город, сбрасываем выбранный пост
            if (key === 'city' && prev.city !== value) {
                setTabSettings(current => ({
                    ...current,
                    posts: {
                        ...current.posts,
                        selectedPost: ''
                    }
                }));
            }

            return newSettings;
        });
    };

    // Обработчик изменения локальных настроек вкладки
    const handleTabSettingChange = <T extends keyof TabSettings>(
        tab: T,
        key: keyof TabSettings[T],
        value: string
    ) => {
        setTabSettings(prev => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                [key]: value
            }
        }));
    };

    return {
        globalSettings,
        tabSettings,
        handleGlobalSettingChange,
        handleTabSettingChange
    };
};
