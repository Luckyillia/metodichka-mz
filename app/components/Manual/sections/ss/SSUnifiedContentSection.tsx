import React, { useMemo, useState } from 'react';

import EventsSection from './UnifiedContent/EventsSection';
import LecturesSection from './UnifiedContent/LecturesSection';
import PracticalTasksSection from './UnifiedContent/PracticalTasksSection';
import TrainingSection from './UnifiedContent/TrainingSection';

const UnifiedContentSection = () => {
    const [activeTab, setActiveTab] = useState<'lectures' | 'training' | 'events' | 'practicalTasks'>('lectures');

    const tabs = useMemo(() => [
        { id: 'lectures' as const, label: '📚 Лекции', icon: '📚', component: LecturesSection },
        { id: 'training' as const, label: '🏃 Тренировки', icon: '🏃', component: TrainingSection },
        { id: 'events' as const, label: '🎯 Мероприятия', icon: '🎯', component: EventsSection },
        { id: 'practicalTasks' as const, label: '🛠️ Практические задания', icon: '🛠️', component: PracticalTasksSection },
    ], []);

    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const ActiveComponent = activeTabData?.component || LecturesSection;

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

            <ActiveComponent />
        </>
    );
};

export default UnifiedContentSection;
