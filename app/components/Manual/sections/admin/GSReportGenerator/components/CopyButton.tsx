import React from 'react';
import { BUTTON_CLASSES } from '../constants';
import { CityData } from '../types';
import { 
    calculateTotalInterviews, 
    calculateTotalHired, 
    calculateTotalWarnings 
} from '../utils';

interface CopyButtonProps {
    cities: CityData[];
    onCopy: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ cities, onCopy }) => {
    const totalInterviews = calculateTotalInterviews(cities);
    const totalHired = calculateTotalHired(cities);
    const totalWarnings = calculateTotalWarnings(cities);

    return (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">✅ Готово к копированию</h3>
                    <p className="text-green-200">Полный отчет ГС по всем городам сформирован</p>
                    <p className="text-sm text-green-300 mt-1">
                        Всего собеседований: {totalInterviews} | 
                        Принято: {totalHired} | 
                        Выговоров: {totalWarnings}
                    </p>
                </div>
                <button
                    onClick={onCopy}
                    className={BUTTON_CLASSES.primary}
                >
                    📋 Скопировать отчет ГС
                </button>
            </div>
        </div>
    );
};