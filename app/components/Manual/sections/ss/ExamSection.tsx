import React, { useState } from 'react';
import GeneralInfo from './Exams/GeneralInfo';
import InternToFeldsher from './Exams/InternToFeldsher';
import FeldsherToLab from './Exams/FeldsherToLab';
import LabToIntern from './Exams/LabToIntern';

const ExamSection = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: '📌 Общая информация', icon: '📌' },
        { id: 'intern', label: '📖 Интерн → Фельдшер (1→2)', icon: '📖' },
        { id: 'feldsher', label: '🚑 Фельдшер → Лаборант (2→3)', icon: '🚑' },
        { id: 'lab', label: '🔬 Лаборант → Врач-стажёр (3→4)', icon: '🔬' }
    ];

    return (
        <div className="exam-section">
            <h2 className="text-2xl font-bold mb-6">📋 Экзамены и проверки знаний</h2>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-2 border-border'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'general' && <GeneralInfo />}
                {activeTab === 'intern' && <InternToFeldsher />}
                {activeTab === 'feldsher' && <FeldsherToLab />}
                {activeTab === 'lab' && <LabToIntern />}
            </div>
        </div>
    );
};

export default ExamSection;