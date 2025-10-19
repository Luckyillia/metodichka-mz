import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { CallsSettings, GlobalSettings } from '../types';
import { cities } from '../constants';

interface CallsTabProps {
    settings: CallsSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof CallsSettings, value: string) => void;
}

// Генерация команд для вызовов
const generateCallsCommands = (settings: CallsSettings, globalSettings: GlobalSettings) => {
    const { callNumber, partnerName } = settings;
    const { city, doctorTag } = globalSettings;
    const hospital = city === 'Мирный' ? 'ОКБ' : 'ЦГБ';
    const partner = partnerName ? ` | Напарник: ${partnerName}.` : '';

    return {
        'Прием вызова': [`r [${doctorTag}] Принял вызов № ${callNumber}.${partner}`],
        'Прибытие на место': [`r [${doctorTag}] Прибыл на место вызова № ${callNumber}.${partner}`],
        'Госпитализация': [`r [${doctorTag}] Госпитализирую в ${hospital} № ${callNumber}.${partner}`],
        'Передача пациенту': [`r [${doctorTag}] Передан в приемное отделение ${hospital}, вызов № ${callNumber}${partner}`],
        'Вызов обработан': [`r [${doctorTag}] Вызов № ${callNumber} | Обработан.${partner}`],
        'Ложный вызов': [`r [${doctorTag}] Вызов № ${callNumber} | Ложный.${partner}`],
        'Отмена вызова': [`r [${doctorTag}] Вызов № ${callNumber} | Отменен.${partner}`]
    };
};

const CallsTab: React.FC<CallsTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = generateCallsCommands(settings, globalSettings);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3>🚑 Команды для работы с вызовами</h3>
                <div className="flex gap-2 flex-wrap">
                    <div>
                        <label className="block text-sm font-medium mb-1">№ вызова:</label>
                        <input
                            type="text"
                            value={settings.callNumber}
                            onChange={(e) => onSettingChange('callNumber', e.target.value)}
                            placeholder="1"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        />
                    </div>
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

export default CallsTab;
