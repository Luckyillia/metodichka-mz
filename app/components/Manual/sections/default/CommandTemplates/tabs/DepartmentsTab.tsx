import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { DepartmentsSettings, GlobalSettings } from '../types';
import { departments } from '../constants';

interface DepartmentsTabProps {
    settings: DepartmentsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof DepartmentsSettings, value: string) => void;
}

// Генерация команд для департаментов
const generateDepartmentsCommands = (settings: DepartmentsSettings, globalSettings: GlobalSettings) => {
    const { toDepartment, reason } = settings;
    const { city } = globalSettings;

    // Автоматически определяем "От" по городу
    const fromDepartment = city === 'Мирный' ? 'ОКБ-М' : city === 'Приволжск' ? 'ЦГБ-П' : 'ЦГБ-Н';

    return {
        'Запрос наряда МВД (ОКБ)': [`d [${fromDepartment}] [${toDepartment}] Запрашиваю наряд сотрудников в здание ${fromDepartment} | Причина: ${reason}.`],
        'Запрос наряда МВД (Таксопарк)': [`d [${fromDepartment}] [${toDepartment}] Запрашиваю наряд сотрудников в таксопарк г.${city} | Причина: ${reason}.`],
        'Запрос наряда МВД (ГУВД)': [`d [${fromDepartment}] [${toDepartment}] Запрашиваю наряд сотрудников в ГУВД г.${city} | Причина: ${reason}.`],
        'Запрос наряда МВД (Банк)': [`d [${fromDepartment}] [${toDepartment}] Запрашиваю наряд сотрудников в Банк г.${city} | Причина: ${reason}.`],
        'Запрос разрешения на посадку': [`d [${fromDepartment}] [${toDepartment}] Запрашиваю разрешения на посадку воздушного судна. Причина: ${reason}.`],
        'Разрешение на посадку': [`d [${fromDepartment}][${toDepartment}] Разрешаю!`],
        'Начало движения колонной': [`d [${fromDepartment}] [РЖД] Начинаем движение колонной. Скорость в городе 60км\\час, за городом 90км\\час`]
    };
};

const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = generateDepartmentsCommands(settings, globalSettings);
    const fromDepartment = globalSettings.city === 'Мирный' ? 'ОКБ-М' : globalSettings.city === 'Приволжск' ? 'ЦГБ-П' : 'ЦГБ-Н';

    return (
        <>
            <div className="mb-4">
                <h3>📢 Доклады в департаменты</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Кому:</label>
                        <select
                            value={settings.toDepartment}
                            onChange={(e) => onSettingChange('toDepartment', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Причина:</label>
                        <input
                            type="text"
                            value={settings.reason}
                            onChange={(e) => onSettingChange('reason', e.target.value)}
                            placeholder="Укажите причину"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-3">
                {Object.entries(commands).map(([commandName, commandLines]) => (
                    <div key={commandName} className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">{commandName}</h4>
                        {commandLines.map((line, index) => (
                            <ExamplePhrase
                                key={`${commandName}-${index}`}
                                text={line}
                                messageType={"single"}
                                type={"ms"}
                                maxLength={200}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default DepartmentsTab;
