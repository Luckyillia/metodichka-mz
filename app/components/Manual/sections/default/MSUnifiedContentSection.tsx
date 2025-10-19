import React, { useState, Suspense, lazy } from 'react';

const UnifiedContentSection = () => {
    const [activeTab, setActiveTab] = useState< 'operations' | 'procedures' | 'rptask'>('operations');

    // Динамическая загрузка компонентов
    const OperationsSection = lazy(() => import('./UnifiedContent/OperationsSection'));
    const ProceduresSection = lazy(() => import('./UnifiedContent/ProceduresSection'));
    const RPTaskSection = lazy(() => import('./UnifiedContent/RPTaskSection'));

    const tabs = [
        { id: 'operations' as const, label: '🏥 Операции', icon: '🏥', component: OperationsSection },
        { id: 'procedures' as const, label: '💊 Процедуры', icon: '💊', component: ProceduresSection },
        { id: 'rptask' as const, label: '🎯 РП задания', icon: '🎯', component: RPTaskSection },
    ];

    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const ActiveComponent = activeTabData?.component || OperationsSection;

    return (
        <>
            <div className="subsection">
                <h3>📋 Обучающие материалы</h3>
                <p>Выберите раздел для просмотра содержимого</p>
            </div>

            {/* Вкладки */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Динамический контент */}
            <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Загрузка раздела...</div>
                </div>
            }>
                <ActiveComponent />
            </Suspense>
        </>
    );
};

export default UnifiedContentSection;
