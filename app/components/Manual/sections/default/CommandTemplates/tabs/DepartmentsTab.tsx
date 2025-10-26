import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { DepartmentsSettings, GlobalSettings } from '../types';
import { departments } from '../constants';

interface DepartmentsTabProps {
    settings: DepartmentsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof DepartmentsSettings, value: string) => void;
}

const DepartmentsTab: React.FC<DepartmentsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const { city } = globalSettings;
    const fromDepartment = city === 'Мирный' ? 'ОКБ-М' : city === 'Приволжск' ? 'ЦГБ-П' : 'ЦГБ-Н';

    return (
        <>
            {/* Запрос наряда МВД */}
            <div className="subsection">
                <h3>🚔 Запрос наряда МВД</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Департамент:</label>
                        <select
                            value={settings.mvdDepartment}
                            onChange={(e) => onSettingChange('mvdDepartment', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Место (куда приехать):</label>
                        <input
                            type="text"
                            value={settings.mvdLocation}
                            onChange={(e) => onSettingChange('mvdLocation', e.target.value)}
                            placeholder="здание ОКБ-М"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Причина:</label>
                        <input
                            type="text"
                            value={settings.mvdReason}
                            onChange={(e) => onSettingChange('mvdReason', e.target.value)}
                            placeholder="неадекватные граждане"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2 mt-4">
                    <ExamplePhrase
                        text={`d [${fromDepartment}] [${settings.mvdDepartment}] Запрашиваю наряд сотрудников в ${settings.mvdLocation} | Причина: ${settings.mvdReason}.`}
                        messageType={"single"}
                        type={"ms"}
                        maxLength={200}
                    />
                </div>
            </div>

            {/* Запрос разрешения на посадку */}
            <div className="subsection">
                <h3>🚁 Запрос разрешения на посадку</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Департамент:</label>
                        <select
                            value={settings.landingDepartment}
                            onChange={(e) => onSettingChange('landingDepartment', e.target.value)}
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
                            value={settings.landingReason}
                            onChange={(e) => onSettingChange('landingReason', e.target.value)}
                            placeholder="экстренная транспортировка пациента"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
                </div>
                <div className="space-y-2 mt-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Запрос разрешения</h4>
                    <ExamplePhrase
                        text={`d [${fromDepartment}] [${settings.landingDepartment}] Запрашиваю разрешения на посадку воздушного судна. Причина: ${settings.landingReason}.`}
                        messageType={"single"}
                        type={"ms"}
                        maxLength={200}
                    />
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 mt-4">Разрешение на посадку</h4>
                    <ExamplePhrase
                        text={`d [${fromDepartment}] [${settings.landingDepartment}] Разрешаю!`}
                        messageType={"single"}
                        type={"ms"}
                        maxLength={200}
                    />
                </div>
            </div>

            {/* Начало движения колонной */}
            <div className="subsection">
                <h3>🚗 Начало движения колонной</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Департамент:</label>
                        <select
                            value={settings.columnDepartment}
                            onChange={(e) => onSettingChange('columnDepartment', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="space-y-2 mt-4">
                    <ExamplePhrase
                        text={`d [${fromDepartment}] [${settings.columnDepartment}] Начинаем движение колонной. Скорость в городе 60км\\час, за городом 90км\\час`}
                        messageType={"single"}
                        type={"ms"}
                        maxLength={200}
                    />
                </div>
            </div>

            {/* Общие доклады */}
            <div className="subsection">
                <h3>📢 Общие доклады</h3>
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
        </>
    );
};

export default DepartmentsTab;
