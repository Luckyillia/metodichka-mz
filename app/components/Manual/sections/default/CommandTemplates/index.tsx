import React, { useState } from 'react';
import { useCommandSettings } from './hooks/useCommandSettings';
import { TabType } from './types';
import { tagAbbreviations, doctorTags, hospitalAbbreviations, otherAbbreviations } from './constants';

// Импорт вкладок
import CallsTab from './tabs/CallsTab';
import PatrolTab from './tabs/PatrolTab';
import PostsTab from './tabs/PostsTab';
import ShiftTab from './tabs/ShiftTab';
import DepartmentsTab from './tabs/DepartmentsTab';
import BindsTab from './tabs/BindsTab';
import SATab from './tabs/SATab';
import GVMUTab from './tabs/GVMUTab';

const CommandTemplatesSection = () => {
    const {
        globalSettings,
        tabSettings,
        handleGlobalSettingChange,
        handleTabSettingChange
    } = useCommandSettings();

    const [activeTab, setActiveTab] = useState<TabType>('calls');

    // Функции для обработки изменений настроек каждой вкладки
    const handleCallsSettingChange = (key: keyof typeof tabSettings.calls, value: string) => {
        handleTabSettingChange('calls', key, value);
    };

    const handlePatrolSettingChange = (key: keyof typeof tabSettings.patrol, value: string) => {
        handleTabSettingChange('patrol', key, value);
    };

    const handlePostsSettingChange = (key: keyof typeof tabSettings.posts, value: string) => {
        handleTabSettingChange('posts', key, value);
    };

    const handleShiftSettingChange = (key: keyof typeof tabSettings.shift, value: string) => {
        handleTabSettingChange('shift', key, value);
    };

    const handleDepartmentsSettingChange = (key: keyof typeof tabSettings.departments, value: string) => {
        handleTabSettingChange('departments', key, value);
    };

    const handleBindsSettingChange = (key: keyof typeof tabSettings.binds, value: string) => {
        handleTabSettingChange('binds', key, value);
    };

    const handleSASettingChange = (key: keyof typeof tabSettings.sa, value: string) => {
        handleTabSettingChange('sa', key, value);
    };

    const handleGVMUSettingChange = (key: keyof typeof tabSettings.gvmu, value: string) => {
        handleTabSettingChange('gvmu', key, value);
    };

    return (
        <>
            <div className="subsection">
                <h3>💬 Бинды и доклады</h3>
                <p>Настройте команды и доклады для каждой категории и копируйте готовые шаблоны.</p>
            </div>

            {/* Глобальные настройки */}
            <div className="subsection">
                <h3>⚙️ Глобальные настройки</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Город:</label>
                        <select
                            value={globalSettings.city}
                            onChange={(e) => handleGlobalSettingChange('city', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                            <option value="Мирный">Мирный</option>
                            <option value="Приволжск">Приволжск</option>
                            <option value="Невский">Невский</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Тег врача:</label>
                        <div className="space-y-2">
                            <select
                                value={globalSettings.doctorTag}
                                onChange={(e) => handleGlobalSettingChange('doctorTag', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                            >
                                {doctorTags.map(tag => (
                                    <option key={tag.value} value={tag.value}>
                                        {tag.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                {tagAbbreviations[globalSettings.doctorTag as keyof typeof tagAbbreviations]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Вкладки */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveTab('calls')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'calls'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    🚑 Вызовы
                </button>
                <button
                    onClick={() => setActiveTab('patrol')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'patrol'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    🚔 Патруль
                </button>
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'posts'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    📍 Посты
                </button>
                <button
                    onClick={() => setActiveTab('shift')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'shift'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    ⏰ Смена
                </button>
                <button
                    onClick={() => setActiveTab('departments')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'departments'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    📢 Департаменты
                </button>
                <button
                    onClick={() => setActiveTab('binds')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'binds'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    🎯 Бинды
                </button>
                <button
                    onClick={() => setActiveTab('sa')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'sa'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    🚁 СА
                </button>
                <button
                    onClick={() => setActiveTab('gvmu')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'gvmu'
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                >
                    ⚔️ ГВМУ
                </button>
            </div>

            {/* Контент вкладок */}
            <div className="subsection">
                {activeTab === 'calls' && (
                    <CallsTab
                        settings={tabSettings.calls}
                        globalSettings={globalSettings}
                        onSettingChange={handleCallsSettingChange}
                    />
                )}

                {activeTab === 'patrol' && (
                    <PatrolTab
                        settings={tabSettings.patrol}
                        globalSettings={globalSettings}
                        onSettingChange={handlePatrolSettingChange}
                    />
                )}

                {activeTab === 'posts' && (
                    <PostsTab
                        settings={tabSettings.posts}
                        globalSettings={globalSettings}
                        onSettingChange={handlePostsSettingChange}
                    />
                )}

                {activeTab === 'shift' && (
                    <ShiftTab
                        settings={tabSettings.shift}
                        globalSettings={globalSettings}
                        onSettingChange={handleShiftSettingChange}
                    />
                )}

                {activeTab === 'departments' && (
                    <DepartmentsTab
                        settings={tabSettings.departments}
                        globalSettings={globalSettings}
                        onSettingChange={handleDepartmentsSettingChange}
                    />
                )}

                {activeTab === 'binds' && (
                    <BindsTab
                        settings={tabSettings.binds}
                        globalSettings={globalSettings}
                        onSettingChange={handleBindsSettingChange}
                    />
                )}

                {activeTab === 'sa' && (
                    <SATab
                        settings={tabSettings.sa}
                        globalSettings={globalSettings}
                        onSettingChange={handleSASettingChange}
                    />
                )}

                {activeTab === 'gvmu' && (
                    <GVMUTab
                        settings={tabSettings.gvmu}
                        globalSettings={globalSettings}
                        onSettingChange={handleGVMUSettingChange}
                    />
                )}
            </div>

            {/* Расшифровки аббревиатур */}
            <div className="subsection">
                <h3>📚 Расшифровки аббревиатур</h3>

                <div className="mb-6">
                    <h4 className="text-lg font-medium mb-3">🏥 Теги врачей</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(tagAbbreviations).map(([abbr, fullName]) => (
                            <div key={abbr} className="p-3 border border-border rounded-lg">
                                <span className="font-medium">{abbr}</span> - {fullName}
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-medium mb-3">🏥 Названия больниц</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(hospitalAbbreviations).map(([abbr, fullName]) => (
                            <div key={abbr} className="p-3 border border-border rounded-lg">
                                <span className="font-medium">{abbr}</span> - {fullName}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-3">🏥 Другие аббревиатуры</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(otherAbbreviations).map(([abbr, fullName]) => (
                            <div key={abbr} className="p-3 border border-border rounded-lg">
                                <span className="font-medium">{abbr}</span> - {fullName}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="note">
                <strong>💡 Советы по использованию:</strong>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Каждая строчка команды теперь генерируется динамически</li>
                    <li>Локальные настройки для каждой вкладки работают независимо</li>
                    <li>Тег врача применяется глобально ко всем командам</li>
                    <li>В департаментах можно редактировать оба поля в квадратных скобках</li>
                </ul>
            </div>
        </>
    );
};

export default CommandTemplatesSection;
