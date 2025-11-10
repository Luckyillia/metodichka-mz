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
    onDownloadDocx: () => void;
}
export const CopyButton: React.FC<CopyButtonProps> = ({ cities, onCopy, onDownloadDocx }) => {
    const totalInterviews = calculateTotalInterviews(cities);
    const totalHired = calculateTotalHired(cities);
    const totalWarnings = calculateTotalWarnings(cities);

    return (
        <div className="bg-primary/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-primary/30 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">✅ Готово к копированию</h3>
                    <p className="text-muted-foreground">Полный отчет ГС по всем городам сформирован</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Всего собеседований: {totalInterviews} | 
                        Принято: {totalHired} | 
                        Выговоров: {totalWarnings}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onDownloadDocx}
                        className="px-8 py-4 bg-accent text-accent-foreground rounded-xl hover:opacity-90 transition-all font-semibold text-lg shadow-lg"
                    >
                        📥 Скачать .docx
                    </button>
                    <button
                        onClick={onCopy}
                        className={BUTTON_CLASSES.primary}
                    >
                        📋 Копировать текст
                    </button>
                </div>
            </div>
        </div>
    );
};