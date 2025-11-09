import React from 'react';

interface ReportPreviewProps {
    reportText: string;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ reportText }) => {
    return (
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">👁️ Предпросмотр отчета</h3>
            <pre className="bg-black/30 p-4 rounded-lg text-sm text-green-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto border border-green-500/20">
                {reportText}
            </pre>
        </div>
    );
};