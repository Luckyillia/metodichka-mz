import React from 'react';
import { CityData } from '../types';
import { INPUT_CLASSES, BUTTON_CLASSES } from '../constants';
import { LeaderReportInput } from './LeaderReportInput';
import { ParsedDataDisplay } from './ParsedDataDisplay';
import { AdditionalDataForm } from './AdditionalDataForm';

interface CityCardProps {
    city: CityData;
    cityIndex: number;
    totalCities: number;
    onUpdateCity: (cityIndex: number, field: keyof CityData, value: any) => void;
    onUpdateParsedData: (cityIndex: number, field: string, value: any) => void;
    onClearData: (cityIndex: number) => void;
    onRemoveCity: (cityIndex: number) => void;
    onReportChange: (cityIndex: number, reportIndex: number, value: string) => void;
    onReportPaste: (cityIndex: number, reportIndex: number, text: string) => void;
    onAddReport: (cityIndex: number) => void;
    onRemoveReport: (cityIndex: number, reportIndex: number) => void;
    onUnlockReport: (cityIndex: number, reportIndex: number) => void;
    onAddItem: (cityIndex: number, field: string, template: any) => void;
    onRemoveItem: (cityIndex: number, field: string, itemIndex: number) => void;
    onItemChange: (cityIndex: number, field: string, itemIndex: number, itemField: string, value: string) => void;
}

export const CityCard: React.FC<CityCardProps> = ({
    city,
    cityIndex,
    totalCities,
    onUpdateCity,
    onUpdateParsedData,
    onClearData,
    onRemoveCity,
    onReportChange,
    onReportPaste,
    onAddReport,
    onRemoveReport,
    onUnlockReport,
    onAddItem,
    onRemoveItem,
    onItemChange
}) => {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🏥</span>
                        {city.name || `Город #${cityIndex + 1}`}
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                        📋 Вставлено отчетов: {city.leaderReports.filter(r => r.trim()).length} | 
                        📊 Собеседований: {city.parsedData.interviews.length} | 
                        👥 Принято: {city.parsedData.totalHired} | 
                        ⚠️ Выговоров: {city.parsedData.warnings.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onClearData(cityIndex)}
                        className={BUTTON_CLASSES.secondary}
                        title="Очистить все данные и начать заново"
                    >
                        🔄 Сброс
                    </button>
                    {totalCities > 1 && (
                        <button
                            onClick={() => onRemoveCity(cityIndex)}
                            className={BUTTON_CLASSES.secondary}
                        >
                            ✕ Удалить город
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Название города */}
                <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Название города</label>
                    <input
                        type="text"
                        value={city.name}
                        onChange={(e) => onUpdateCity(cityIndex, 'name', e.target.value)}
                        placeholder="ЦДБ-П"
                        className={INPUT_CLASSES.base}
                    />
                </div>

                {/* Отчеты лидера */}
                <LeaderReportInput
                    reports={city.leaderReports}
                    cityIndex={cityIndex}
                    onReportChange={onReportChange}
                    onReportPaste={onReportPaste}
                    onAddReport={onAddReport}
                    onRemoveReport={onRemoveReport}
                    onUnlock={onUnlockReport}
                />

                {/* Распарсенные данные */}
                <ParsedDataDisplay
                    data={city.parsedData}
                    cityIndex={cityIndex}
                    onUpdateField={onUpdateParsedData}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                    onItemChange={onItemChange}
                />

                {/* Дополнительные данные */}
                <AdditionalDataForm
                    city={city}
                    cityIndex={cityIndex}
                    onUpdate={onUpdateCity}
                />
            </div>
        </div>
    );
};