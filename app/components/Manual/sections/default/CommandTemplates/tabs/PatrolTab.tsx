import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { PatrolSettings, GlobalSettings } from '../types';

interface PatrolTabProps {
    settings: PatrolSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof PatrolSettings, value: string) => void;
}

// Генерация команд для патруля
const generatePatrolCommands = (settings: PatrolSettings, globalSettings: GlobalSettings) => {
    const { partnerName } = settings;
    const { city, doctorTag } = globalSettings;
    const hospitalCode = city === 'Мирный' ? 'ОКБ-М' : city === 'Приволжск' ? 'ЦГБ-П' : 'ЦГБ-Н';
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';
    const partner = partnerName ? ` | Напарник: ${partnerName}.` : '';

    return {
        'Выезд в патруль': [`r [${doctorTag}] Выехал в свободное патрулирование города.${partner}`],
        'Продолжение патруля': [`r [${doctorTag}] Продолжаю свободное патрулирование города. Обстановка: Спокойная.${partner}`],
        'Инцидент в патруле': [`r [${doctorTag}] Продолжаю свободное патрулирование города. Обстановка: Произошел инцидент.${partner}`],
        'Возвращение из патруля': [`r [${doctorTag}] Вернулся с свободного патрулирования города.${partner}`],
        'Выезд в междугородний патруль': [`ro [${hospitalCode} | ${doctorTag}] Выехал в свободное-междугороднее патрулирование.${partner}`],
        'Продолжение междугороднего патруля': [`ro [${hospitalCode} | ${doctorTag}] Продолжаю свободное-междугороднее патрулирование. | Обстановка: Спокойная.${partner}`],
        'Возвращение из междугороднего патруля': [`ro [${hospitalCode} | ${doctorTag}] Вернулся со свободного-междугороднего патрулирования в ${hospital}.${partner}`]
    };
};

const PatrolTab: React.FC<PatrolTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = generatePatrolCommands(settings, globalSettings);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3>🚔 Команды для патрулирования</h3>
                <div className="flex gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium mb-1">Напарник:</label>
                        <input
                            type="text"
                            value={settings.partnerName}
                            onChange={(e) => onSettingChange('partnerName', e.target.value)}
                            placeholder="Имя напарника"
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

export default PatrolTab;
