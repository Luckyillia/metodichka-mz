import React from 'react';
import { ParsedData } from '../types';
import { StatCard } from './StatCard';
import { ListItemEditor } from './ListItemEditor';
import { INPUT_CLASSES } from '../constants';

interface ParsedDataDisplayProps {
    data: ParsedData;
    cityIndex: number;
    onUpdateField: (cityIndex: number, field: string, value: any) => void;
    onAddItem: (cityIndex: number, field: string, template: any) => void;
    onRemoveItem: (cityIndex: number, field: string, itemIndex: number) => void;
    onItemChange: (cityIndex: number, field: string, itemIndex: number, itemField: string, value: string) => void;
}

export const ParsedDataDisplay: React.FC<ParsedDataDisplayProps> = ({
    data,
    cityIndex,
    onUpdateField,
    onAddItem,
    onRemoveItem,
    onItemChange
}) => {
    return (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-green-300 mb-4">
                ✅ Автоматически извлеченные данные
            </h4>
            
            <div className="space-y-4">
                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard label="Принято" value={data.totalHired} />
                    <StatCard label="Уволено ПСЖ" value={data.firedPSJ} />
                    <StatCard label="Обзвонов" value={data.callsPerWeek} />
                    <StatCard label="Выговоров" value={data.warnings.length} />
                </div>

                {/* Состав */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {['firstRanks', 'middleStaff', 'seniorStaff', 'managementStaff', 'totalStaff'].map((field, idx) => (
                        <div key={field}>
                            <label className="block text-xs text-purple-300 mb-1">
                                {['Младший', 'Средний', 'Старший', 'Руководящий', 'Всего'][idx]}
                            </label>
                            <input
                                type="text"
                                value={data[field as keyof ParsedData] as string}
                                onChange={(e) => onUpdateField(cityIndex, field, e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    ))}
                </div>

                {/* Кадровые перестановки */}
                <div>
                    <label className="block text-sm text-purple-300 mb-2">Кадровые перестановки</label>
                    <textarea
                        value={data.staffChanges}
                        onChange={(e) => onUpdateField(cityIndex, 'staffChanges', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                {/* Списки */}
                {[
                    { field: 'interviews', label: '📝 Собеседования', type: 'link' as const },
                    { field: 'lectures', label: '📚 Лекции', type: 'nameLink' as const },
                    { field: 'trainings', label: '🏋️ Тренировки', type: 'nameLink' as const },
                    { field: 'events', label: '🎉 Мероприятия', type: 'nameLink' as const },
                    { field: 'interfactionEvents', label: '🤝 Мероприятия с постом', type: 'link' as const },
                    { field: 'warnings', label: '⚠️ Выговоры', type: 'warning' as const }
                ].map(({ field, label, type }) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-purple-300 mb-2">
                            {label} ({(data[field as keyof ParsedData] as any[]).length})
                        </label>
                        <ListItemEditor
                            items={data[field as keyof ParsedData] as any[]}
                            onAdd={onAddItem}
                            onRemove={onRemoveItem}
                            onChange={onItemChange}
                            itemType={type}
                            cityIndex={cityIndex}
                            field={field}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};