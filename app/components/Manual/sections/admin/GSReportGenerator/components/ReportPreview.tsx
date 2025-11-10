import React from 'react';

interface ReportPreviewProps {
    reportText: string;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ reportText }) => {
    return (
        <div className="bg-card backdrop-blur-lg rounded-2xl p-6 border-2 border-border shadow-xl">
            <h3 className="text-xl font-semibold text-foreground mb-4">👁️ Предпросмотр отчета</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm text-foreground whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto border-2 border-border">
                {reportText}
            </pre>
        </div>
    );
};