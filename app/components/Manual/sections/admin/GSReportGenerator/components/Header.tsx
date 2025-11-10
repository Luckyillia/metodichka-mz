import React from 'react';

export const Header: React.FC = () => {
    return (
        <div className="bg-card backdrop-blur-lg rounded-2xl p-6 border-2 border-border shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📊</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Генератор отчета ГС</h1>
                    <p className="text-muted-foreground">Вставляйте несколько недельных отчетов лидера для автоматического суммирования</p>
                </div>
            </div>
        </div>
    );
};