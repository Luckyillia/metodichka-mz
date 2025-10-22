import React, { useState, Suspense, lazy } from 'react';

const UnifiedContentSection = () => {
    const [activeTab, setActiveTab] = useState< 'operations' | 'procedures' | 'rptask'>('operations');
    const [gender, setGender] = useState<'male' | 'female'>('male');

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

    // Определяем текст для перемикача в зависимости от активной вкладки
    const getGenderLabel = () => {
        if (activeTab === 'rptask') {
            return 'Пол сотрудника';
        }
        return 'Пол пациента';
    };

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

            {/* Общий переключатель пола */}
            <div className="subsection">
                <h3>👤 {getGenderLabel()}</h3>
                <p className="text-sm text-muted-foreground mb-3">Выберите пол для адаптации отыгровок</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setGender('male')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            gender === 'male'
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'bg-secondary border-border text-foreground hover:border-blue-500/50'
                        }`}
                    >
                        <span className="text-2xl mr-2">👨</span>
                        Мужчина
                    </button>
                    <button
                        onClick={() => setGender('female')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            gender === 'female'
                                ? 'bg-pink-500 border-pink-500 text-white'
                                : 'bg-secondary border-border text-foreground hover:border-pink-500/50'
                        }`}
                    >
                        <span className="text-2xl mr-2">👩</span>
                        Женщина
                    </button>
                </div>
            </div>

            {/* Динамический контент */}
            <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Загрузка раздела...</div>
                </div>
            }>
                <ActiveComponent gender={gender} />
            </Suspense>
        </>
    );
};

export default UnifiedContentSection;
