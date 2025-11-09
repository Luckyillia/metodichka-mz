import React from 'react';

export const Header: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/90 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">📊</span>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Генератор отчета ГС</h1>
                    <p className="text-gray-300">Вставляйте несколько недельных отчетов лидера для автоматического суммирования</p>
                </div>
            </div>
        </div>
    );
};