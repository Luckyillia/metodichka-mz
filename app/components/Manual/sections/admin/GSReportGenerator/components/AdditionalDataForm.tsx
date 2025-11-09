import React from 'react';
import { CityData } from '../types';
import { INPUT_CLASSES } from '../constants';

interface AdditionalDataFormProps {
    city: CityData;
    cityIndex: number;
    onUpdate: (cityIndex: number, field: keyof CityData, value: string) => void;
}

export const AdditionalDataForm: React.FC<AdditionalDataFormProps> = ({
    city,
    cityIndex,
    onUpdate
}) => {
    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-yellow-300 mb-4">
                📝 Дополнительные данные (не из отчета лидера)
            </h4>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Назначение лидера</label>
                    <textarea
                        value={city.leaderAppointment}
                        onChange={(e) => onUpdate(cityIndex, 'leaderAppointment', e.target.value)}
                        placeholder="Nick_Name - назначен на пост лидера... Дата"
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Баны лидера</label>
                        <input
                            type="text"
                            value={city.leaderBans}
                            onChange={(e) => onUpdate(cityIndex, 'leaderBans', e.target.value)}
                            placeholder="-"
                            className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Выговоры лидеру</label>
                        <input
                            type="text"
                            value={city.leaderWarnings}
                            onChange={(e) => onUpdate(cityIndex, 'leaderWarnings', e.target.value)}
                            placeholder="-"
                            className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Снятие лидера</label>
                    <textarea
                        value={city.leaderRemoval}
                        onChange={(e) => onUpdate(cityIndex, 'leaderRemoval', e.target.value)}
                        placeholder="Nick_Name - снят по причине..."
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Оценка работы лидера</label>
                    <textarea
                        value={city.leaderEvaluation}
                        onChange={(e) => onUpdate(cityIndex, 'leaderEvaluation', e.target.value)}
                        placeholder="Работает отлично, недостатков нет"
                        rows={2}
                        className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
            </div>
        </div>
    );
};