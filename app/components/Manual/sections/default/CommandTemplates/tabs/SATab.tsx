import React from 'react';
import { GlobalSettings, SASettings } from '../types';
import ExamplePhrase from '@/app/components/Manual/ExamplePhrase';

// Скорая Авиация (СА) - специализированная медицинская авиационная служба,
// занимающаяся экстренной доставкой медицинских бригад, эвакуацией пострадавших
// и оказанием экстренной медицинской помощи в труднодоступных районах.

interface SATabProps {
    settings: SASettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof SASettings, value: string) => void;
}

const SATab: React.FC<SATabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onSettingChange(name as keyof SASettings, value);
    };

    // Должности Скорой Авиации
    const saPositions = [
        { value: 'Начальник санитарной авиации', tag: 'Нач.СА', rank: '9-10 ранги' },
        { value: 'Заместитель начальника санитарной авиации', tag: 'Зам.Нач.СА', rank: '8 ранг' },
        { value: 'Пилот санитарной авиации', tag: 'ПСА', rank: '7 ранг' },
        { value: 'Фельдшер санитарной авиации', tag: 'ФСА', rank: '5+ ранг' }
    ];

    // Получение больницы по городу
    const getHospitalByCity = () => {
        const cityMap: Record<string, string> = {
            'Мирный': 'ОКБ-М',
            'Приволжск': 'ЦГБ-П',
            'Невский': 'ЦГБ-Н'
        };
        return cityMap[globalSettings.city] || 'ОКБ-М';
    };

    // Генерация команд для СА
    const generateCallCommand = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Вылетели на вызов ${settings.callNumber}. Бригада: ${settings.crewNames}`;
    };

    const generateArrivalCommand = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Прибыли на место вызова. Бригада: ${settings.crewNames}`;
    };

    const generateProcessedOnSiteCommand = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Вызов ${settings.callNumber} обработан на месте. Бригада: ${settings.crewNames}`;
    };

    const generateHospitalizedCommand = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Вызов ${settings.callNumber} госпитализирован. Бригада: ${settings.crewNames}`;
    };

    const generateCityPatrolRequest = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Разрешите взлет на городское патрулирование г. ${globalSettings.city}. Бригада: ${settings.crewNames}`;
    };

    const generateCityPatrolStart = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Вылетели на городское патрулирование г. ${globalSettings.city}. Бригада: ${settings.crewNames}`;
    };

    const generateCityPatrolStatus = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Продолжаем городское патрулирование г. ${globalSettings.city}. Состояние: ${settings.patrolStatus}. Бригада: ${settings.crewNames}`;
    };

    const generateCityPatrolEnd = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        return `r [${position.tag}] Закончили городское патрулирование г. ${globalSettings.city}. Бригада: ${settings.crewNames}`;
    };

    const generateLandingRequest = () => {
        const position = saPositions.find(p => p.value === settings.position) || saPositions[0];
        const hospital = getHospitalByCity();
        return `d [${hospital}][${settings.location}] Запрашиваю разрешения на посадку воздушного судна. Бригада: ${settings.crewNames}`;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Должность:</label>
                    <select
                        name="position"
                        value={settings.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                        <option value="">Выберите должность</option>
                        {saPositions.map(p => (
                            <option key={p.value} value={p.value}>
                                {p.value} ({p.tag})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Номер вызова:</label>
                    <input
                        type="text"
                        name="callNumber"
                        value={settings.callNumber}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Состав бригады:</label>
                    <input
                        type="text"
                        name="crewNames"
                        value={settings.crewNames}
                        onChange={handleInputChange}
                        placeholder="Имя_Фамилия, Имя_Фамилия"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Структура (МВД/РЖД/ГУВД-Н и т.д.):</label>
                    <input
                        type="text"
                        name="location"
                        value={settings.location}
                        onChange={handleInputChange}
                        placeholder="ГУВД-Н, ГИБДД-П, МВД, РЖД"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Состояние патруля:</label>
                    <input
                        type="text"
                        name="patrolStatus"
                        value={settings.patrolStatus}
                        onChange={handleInputChange}
                        placeholder="Чисто, происшествий нет"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-3">📞 Вызовы</h3>
                    <div className="space-y-2">
                        <ExamplePhrase 
                            text={generateCallCommand()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateArrivalCommand()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateProcessedOnSiteCommand()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateHospitalizedCommand()}
                            type="ms"
                            messageType="single"
                        />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-3">🚁 Городское патрулирование</h3>
                    <div className="space-y-2">
                        <ExamplePhrase 
                            text={generateCityPatrolRequest()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateCityPatrolStart()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateCityPatrolStatus()}
                            type="ms"
                            messageType="single"
                        />
                        <ExamplePhrase 
                            text={generateCityPatrolEnd()}
                            type="ms"
                            messageType="single"
                        />
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-3">✈️ Управление воздушным движением</h3>
                    <div className="space-y-2">
                        <ExamplePhrase 
                            text={generateLandingRequest()}
                            type="ms"
                            messageType="single"
                        />
                    </div>
                </div>

                <div className="note bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>ℹ️ Примечание:</strong> Все команды автоматически генерируются на основе введенных данных. 
                        Убедитесь, что все поля заполнены корректно перед использованием.
                    </p>
                </div>

                <div className="subsection">
                <h3>📂 Материалы для СА</h3>
                <p>Материалы для СА были взяты с официального сайта СА: <a
                    href="https://forum.gtaprovince.ru/topic/639086-sa-otdel-sanitarnoy-aviacii/"
                    className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
                    <div className="warning mt-4">
                        <strong>⚠️ Важно:</strong> Если найдете ошибку прошу собщить лидеру.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SATab;