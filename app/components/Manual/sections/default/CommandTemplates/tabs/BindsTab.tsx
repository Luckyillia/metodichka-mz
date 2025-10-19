import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { BindsSettings, GlobalSettings } from '../types';

interface BindsTabProps {
    settings: BindsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof BindsSettings, value: string) => void;
}

// Генерация биндов для мужского персонажа
const generateMaleBinds = (settings: BindsSettings, globalSettings: GlobalSettings) => {
    const { firstName, lastName, position } = settings;
    const { city, doctorTag } = globalSettings;
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';

    return {
        'Представление': [
            `bind 1 say Здравствуйте, меня зовут ${firstName} ${lastName}, я сотрудник ${hospital} г. ${city}.`,
            `bind 1 do На груди висит бейдж: [${hospital} г. ${city} | ${position} | ${firstName} ${lastName}].`,
            `bind 2 todo Что вас беспокоит?*посмотрев на пациента`
        ],
        'Осмотр пациента': [
            `bind 3 say Сейчас я Вас осмотрю.`,
            `bind 3 me тщательно осматривает пациента и ставит ему диагноз`,
            `bind 3 do Диагноз поставлен.`
        ],
        'Выдача лекарства': [
            `bind 4 do На плече висит медицинская сумка.`,
            `bind 4 me открыв сумку, достал нужный препарат`,
            `bind 5 do Препарат в руке.`,
            `bind 5 me передал нужный препарат пациенту`,
            `bind 6 chatbox helpmed`
        ],
        'Прощание': [
            `bind 7 say Всего доброго, не болейте!)`
        ],
        'Отказ пациента': [
            `bind 8 say Хорошо, тогда лечитесь в стационаре. Всего вам доброго!)`
        ],
        'Самолечение': [
            `bind num_7 do Через плечо надета мед. сумка с множеством препаратов.`,
            `bind num_7 me открыв сумку, достал из неё необходимое лекарство и употребил его`,
            `bind num_7 chatbox helpmed`
        ]
    };
};

// Генерация биндов для женского персонажа
const generateFemaleBinds = (settings: BindsSettings, globalSettings: GlobalSettings) => {
    const { firstName, lastName, position } = settings;
    const { city, doctorTag } = globalSettings;
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';

    return {
        'Представление': [
            `bind 1 say Здравствуйте, меня зовут ${firstName} ${lastName}, я сотрудница ${hospital} г. ${city}.`,
            `bind 1 do На груди висит бейдж: [${hospital} г. ${city} | ${position} | ${firstName} ${lastName}].`,
            `bind 2 todo Что вас беспокоит?*посмотрев на пациента`
        ],
        'Осмотр пациента': [
            `bind 3 say Сейчас я Вас осмотрю.`,
            `bind 3 me тщательно осматривает пациента и ставит ему диагноз`,
            `bind 3 do Диагноз поставлен.`
        ],
        'Выдача лекарства': [
            `bind 4 do На плече висит медицинская сумка.`,
            `bind 4 me открыв сумку, достала нужный препарат`,
            `bind 5 do Препарат в руке.`,
            `bind 5 me передала нужный препарат пациенту`,
            `bind 6 chatbox helpmed`
        ],
        'Прощание': [
            `bind 7 say Всего доброго, не болейте!)`
        ],
        'Отказ пациента': [
            `bind 8 say Хорошо, тогда лечитесь в стационаре. Всего вам доброго!)`
        ],
        'Самолечение': [
            `bind num_7 do Через плечо надета мед. сумка с множеством препаратов.`,
            `bind num_7 me открыв сумку, достала из неё необходимое лекарство и употребила его`,
            `bind num_7 chatbox helpmed`
        ]
    };
};

const BindsTab: React.FC<BindsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = settings.gender === 'male'
        ? generateMaleBinds(settings, globalSettings)
        : generateFemaleBinds(settings, globalSettings);

    return (
        <>
            <div className="mb-4">
                <h3>🎯 Основные бинды</h3>

                {/* Локальные настройки для биндов */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                        <label className="block text-sm font-medium mb-2">Гендер:</label>
                        <select
                            value={settings.gender}
                            onChange={(e) => onSettingChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Имя:</label>
                        <input
                            type="text"
                            value={settings.firstName}
                            onChange={(e) => onSettingChange('firstName', e.target.value)}
                            placeholder="Имя"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Фамилия:</label>
                        <input
                            type="text"
                            value={settings.lastName}
                            onChange={(e) => onSettingChange('lastName', e.target.value)}
                            placeholder="Фамилия"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Должность:</label>
                        <input
                            type="text"
                            value={settings.position}
                            onChange={(e) => onSettingChange('position', e.target.value)}
                            placeholder="Должность"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Стационарное лечение */}
            <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">🏥 Стационарное лечение пациента</h4>
                <div className="space-y-4">
                    {Object.entries(commands).map(([bindName, bindLines]) => (
                        <div key={bindName} className="p-4 border border-border rounded-lg">
                            <h5 className="font-medium mb-3 text-sm text-muted-foreground">{bindName}</h5>
                            <div className="space-y-2">
                                {bindLines.map((line: string, index: number) => (
                                    <ExamplePhrase
                                        key={`${bindName}-${index}`}
                                        text={line}
                                        messageType={"single"}
                                        type={"ms"}
                                        maxLength={200}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BindsTab;
