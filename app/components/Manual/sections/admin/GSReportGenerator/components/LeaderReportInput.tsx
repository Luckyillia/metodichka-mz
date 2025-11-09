// Исправленный LeaderReportInput.tsx
import React from 'react';
import { INPUT_CLASSES, BUTTON_CLASSES } from '../constants';

interface LeaderReportInputProps {
    reports: string[];
    cityIndex: number;
    onReportChange: (cityIndex: number, reportIndex: number, value: string) => void;
    onReportPaste: (cityIndex: number, reportIndex: number, text: string) => void;
    onAddReport: (cityIndex: number) => void;
    onRemoveReport: (cityIndex: number, reportIndex: number) => void;
    onUnlock: (cityIndex: number, reportIndex: number) => void;
}

export const LeaderReportInput: React.FC<LeaderReportInputProps> = ({
    reports,
    cityIndex,
    onReportChange,
    onReportPaste,
    onAddReport,
    onRemoveReport,
    onUnlock
}) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>, reportIndex: number) => {
        const isParsed = reports[reportIndex].trim().length > 50;
        if (isParsed) return;
        
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        
        console.log('Paste event triggered:', {
            cityIndex,
            reportIndex,
            textLength: pastedText.length,
            preview: pastedText.substring(0, 100)
        });
        
        if (!pastedText.trim()) {
            console.log('Empty paste, ignoring');
            return;
        }
        
        onReportPaste(cityIndex, reportIndex, pastedText);
    };

    return (
        <div className="bg-gradient-to-r from-gray-800/30 to-gray-800/10 border border-gray-700/40 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-blue-300 mb-3">
                📋 Вставьте отчеты лидера (за разные недели)
            </h4>
            {reports.map((report, reportIndex) => {
                const isParsed = report.trim().length > 50;
                return (
                    <div key={reportIndex} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
                                Отчет #{reportIndex + 1}
                                {isParsed && (
                                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">
                                        ✓ Распарсен
                                    </span>
                                )}
                            </label>
                            {reports.length > 1 && (
                                <button
                                    onClick={() => onRemoveReport(cityIndex, reportIndex)}
                                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-sm border border-red-500/30"
                                >
                                    ✕ Удалить
                                </button>
                            )}
                        </div>
                        <textarea
                            value={report}
                            onChange={(e) => onReportChange(cityIndex, reportIndex, e.target.value)}
                            disabled={isParsed}
                            placeholder={`Вставьте сюда отчет лидера за неделю ${reportIndex + 1}. Данные автоматически суммируются с другими отчетами.`}
                            rows={10}
                            className={`${INPUT_CLASSES.textarea} ${isParsed ? INPUT_CLASSES.textareaParsed : INPUT_CLASSES.textareaActive}`}
                            onPaste={(e) => handlePaste(e, reportIndex)}
                        />
                        {isParsed && (
                            <button
                                onClick={() => onUnlock(cityIndex, reportIndex)}
                                className="mt-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 text-xs border border-orange-500/30"
                            >
                                🔓 Разблокировать для редактирования
                            </button>
                        )}
                    </div>
                );
            })}
            <button
                onClick={() => onAddReport(cityIndex)}
                className={BUTTON_CLASSES.addFull}
            >
                ➕ Добавить еще один отчет лидера
            </button>
            <p className="text-xs text-blue-300 mt-3 leading-relaxed">
                💡 Совет: Вставляйте каждый недельный отчет лидера в отдельное поле. Программа автоматически:
                <br />• Суммирует принятых/уволенных/обзвоны/фонды
                <br />• Объединяет собеседования/лекции/мероприятия без дубликатов
                <br />• Берет последние значения состава сотрудников
                <br />• После вставки поле блокируется для предотвращения случайных изменений
            </p>
        </div>
    );
};