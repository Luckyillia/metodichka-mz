import React from 'react';
import ExamplePhrase from '../../../../ExamplePhrase';
import { ShiftSettings, GlobalSettings } from '../types';

interface ShiftTabProps {
    settings: ShiftSettings;
    globalSettings: GlobalSettings;
    onSettingChange: (key: keyof ShiftSettings, value: string) => void;
}

// Генерация команд для смены
const generateShiftCommands = (doctorTag: string) => {
    return {
        'Заступил на смену': [`r [${doctorTag}] Заступил на смену.`],
        'Сдал смену': [`r [${doctorTag}] Сдал смену.`],
        'Ушел на перерыв-обед': [`r [${doctorTag}] Ушел на перерыв-обед.`],
        'Вернулся с перерыва-обед': [`r [${doctorTag}] Вернулся с перерыва-обед.`],
        'Ушел на перерыв-ужин': [`r [${doctorTag}] Ушел на перерыв-ужин.`],
        'Вернулся с перерыва-ужин': [`r [${doctorTag}] Вернулся с перерыва-ужин.`]
    };
};

const ShiftTab: React.FC<ShiftTabProps> = ({ settings, globalSettings, onSettingChange }) => {
    const commands = generateShiftCommands(globalSettings.doctorTag);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3>⏰ Доклады о смене и перерывах</h3>
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

export default ShiftTab;
