"use client"

import React, { useState } from 'react';
import "@/app/styles/reportGenerator.css";

const LeaderReportGenerator = () => {
    // Основные данные
    const [faction, setFaction] = useState('');
    const [nickname, setNickname] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // 2. Собеседования
    const [interviews, setInterviews] = useState([{ link: '' }]);

    // 3. Принятые/Уволенные
    const [firedPSJ, setFiredPSJ] = useState('');
    const [firedOCS, setFiredOCS] = useState('');
    const [totalFired, setTotalFired] = useState('');
    const [totalHired, setTotalHired] = useState('');

    // 4. Количество сотрудников
    const [firstRanks, setFirstRanks] = useState('');
    const [middleStaff, setMiddleStaff] = useState('');
    const [seniorStaff, setSeniorStaff] = useState('');
    const [managementStaff, setManagementStaff] = useState('');
    const [totalStaff, setTotalStaff] = useState('');

    // 5. Обзвоны
    const [callsPerWeek, setCallsPerWeek] = useState('');
    const [callsAccepted, setCallsAccepted] = useState('');

    // 6. Кадровые перестановки
    const [staffChanges, setStaffChanges] = useState('');

    // 7. Выговоры
    const [warnings, setWarnings] = useState([{ nickname: '', reason: '' }]);

    // 8. Фонд неустоек
    const [fundReceived, setFundReceived] = useState('');
    const [fundPaid, setFundPaid] = useState('');
    const [fundBalance, setFundBalance] = useState('');

    // 9. Лекции/тренировки
    const [lectures, setLectures] = useState([{ name: '', link: '' }]);

    // 10. Мероприятия от филиалов
    const [branchEvents, setBranchEvents] = useState([{ name: '', link: '' }]);

    // 11. Межфракционные мероприятия
    const [interfactionEvents, setInterfactionEvents] = useState([{ name: '', link: '' }]);

    // 12. Оценка старшего состава
    const [staffEvaluations, setStaffEvaluations] = useState([{ nickname: '', rating: '', comment: '' }]);

    // Вспомогательные функции
    const handleAddItem = (setter: Function, currentItems: any[], template: any) => {
        setter([...currentItems, template]);
    };

    const handleRemoveItem = (setter: Function, currentItems: any[], index: number) => {
        if (currentItems.length === 1) return;
        const newItems = [...currentItems];
        newItems.splice(index, 1);
        setter(newItems);
    };

    const handleItemChange = (setter: Function, currentItems: any[], index: number, field: string, value: any) => {
        const newItems = [...currentItems];
        newItems[index][field] = value;
        setter(newItems);
    };

    // Генерация отчета
    const generateReport = () => {
        let report = `Отчет от лидера ${faction || 'Фракция'} ${nickname || 'Nick_Name'} в период с ${dateFrom || 'xx.xx.2025'} по ${dateTo || 'xx.xx.2025'}\n\n`;

        // 2. Собеседования
        report += `2) Количество и доказательства проведенных собеседований на сервере.\n`;
        const hasInterviews = interviews.some(item => item.link);
        if (hasInterviews) {
            let counter = 1;
            interviews.forEach((item) => {
                if (item.link) {
                    report += `${counter}. ${item.link}\n`;
                    counter++;
                }
            });
        } else {
            report += `-\n`;
        }
        report += `\n`;

        // 3. Принятые/Уволенные
        report += `3) Количество принятых, уволенных ПСЖ, уволенных с ОЧС сотрудников во фракцию.\n`;
        report += `Кол-во уволенных ПСЖ - ${firedPSJ || 'xx'}\n`;
        report += `Кол-во уволенных с ОЧС - ${firedOCS || 'xx'}\n`;
        report += `Общее кол-во уволенных - ${totalFired || 'xx'}\n`;
        report += `Кол-во принятых - ${totalHired || 'xx'}\n\n`;

        // 4. Количество сотрудников
        report += `4) Количество сотрудников во фракции на момент сдачи отчета - первые ранги, младший состав, средний состав, старший состав, общее количество.\n`;
        report += `Первые ранги - ${firstRanks || 'xx'}\n`;
        report += `Средний состав - ${middleStaff || 'xx'}\n`;
        report += `Старший состав - ${seniorStaff || 'xx'}\n`;
        report += `Руководящий состав - ${managementStaff || 'xx'},с учетом лидера\n`;
        report += `Общее количество сотрудников - ${totalStaff || 'xx'}\n\n`;

        // 5. Обзвоны
        report += `5) Количество проведенных обзвонов и принятых сотрудников в старший состав.\n`;
        report += `Количество обзвонов за неделю - ${callsPerWeek || 'xx'}\n`;
        report += `Количество принятых - ${callsAccepted || 'xx'}\n\n`;

        // 6. Кадровые перестановки
        report += `6) Список кадровых перестановок в старшем составе - никнеймы, отделы, повышения, понижения.\n`;
        report += `${staffChanges || '-'}\n\n`;

        // 7. Выговоры
        report += `7) Список выданных выговоров - никнеймы, причины, количество.\n`;
        const hasWarnings = warnings.some(item => item.nickname || item.reason);
        if (hasWarnings) {
            warnings.forEach((item) => {
                if (item.nickname || item.reason) {
                    report += `${item.nickname || 'Nick_Name'} - ${item.reason || 'получает выговор'}\n`;
                }
            });
        } else {
            report += `-\n`;
        }
        report += `\n`;

        // 8. Фонд неустоек
        report += `8) Фонд неустоек - список полученных и выплаченных, остаток фонда на момент сдачи отчета.\n`;
        report += `Получено - ${fundReceived || 'xx'}\n`;
        report += `Выплачено - ${fundPaid || 'xx'}\n`;
        report += `Остаток - ${fundBalance || 'xx'}\n\n`;

        // 9. Лекции/тренировки
        report += `9) Список проведенных во фракции лекций, тренировок, RP мероприятий и т.п.\n`;
        report += `Лекции:\n`;
        const hasLectures = lectures.some(item => item.name || item.link);
        if (hasLectures) {
            let counter = 1;
            lectures.forEach((item) => {
                if (item.name || item.link) {
                    report += `${counter}. ${item.name || 'Название'} - ${item.link || 'Ссылка'}\n`;
                    counter++;
                }
            });
        } else {
            report += `-\n`;
        }
        report += `\n`;

        // 10. Мероприятия от филиалов
        report += `10) Мероприятий от всех филиалов организации.\n`;
        const hasBranchEvents = branchEvents.some(item => item.name || item.link);
        if (hasBranchEvents) {
            let counter = 1;
            branchEvents.forEach((item) => {
                if (item.name || item.link) {
                    report += `${counter}. ${item.name || 'Название'} - ${item.link || 'Ссылка'}\n`;
                    counter++;
                }
            });
        } else {
            report += `-\n`;
        }
        report += `\n`;

        // 11. Межфракционные мероприятия
        report += `11) Проведение двух межфракционных мероприятий. (С непосредственным участием лидера)\n`;
        const hasInterfactionEvents = interfactionEvents.some(item => item.name || item.link);
        if (hasInterfactionEvents) {
            let counter = 1;
            interfactionEvents.forEach((item) => {
                if (item.name || item.link) {
                    report += `${counter}. ${item.name || 'Название'} - ${item.link || 'Ссылка'}\n`;
                    counter++;
                }
            });
        } else {
            report += `-\n`;
        }
        report += `\n`;

        // 12. Оценка старшего состава
        report += `12) Краткая оценка работы каждого сотрудника старшего состава фракции - заслуги, преуспевания, допущенные ошибки, намеренные нарушения.\n`;
        const hasEvaluations = staffEvaluations.some(item => item.nickname || item.rating || item.comment);
        if (hasEvaluations) {
            staffEvaluations.forEach((item) => {
                if (item.nickname || item.rating || item.comment) {
                    report += `${item.nickname || 'Nick_Name'} - ${item.rating || '0/10'} ${item.comment || 'комментарий'}.\n`;
                }
            });
        } else {
            report += `-\n`;
        }

        return report;
    };

    const copyReport = () => {
        const report = generateReport();
        navigator.clipboard.writeText(report);
        alert('Отчет скопирован в буфер обмена!');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Генератор отчета для лидера</h2>
                    <p className="text-sm text-muted-foreground">Заполните все поля для формирования отчета</p>
                </div>
            </div>

            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">Основная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Фракция</label>
                        <input
                            type="text"
                            value={faction}
                            onChange={(e) => setFaction(e.target.value)}
                            placeholder="Название фракции"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Никнейм</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Nick_Name"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Период с</label>
                        <input
                            type="text"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            placeholder="xx.xx.2025"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Период по</label>
                        <input
                            type="text"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            placeholder="xx.xx.2025"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Собеседования */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">2. Проведенные собеседования</h3>
                {interviews.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item.link}
                            onChange={(e) => handleItemChange(setInterviews, interviews, index, 'link', e.target.value)}
                            placeholder="Ссылка на собеседование"
                            className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <button
                            onClick={() => handleRemoveItem(setInterviews, interviews, index)}
                            className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setInterviews, interviews, { link: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить собеседование
                </button>
            </div>

            {/* 3. Принятые/Уволенные */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">3. Принятые и уволенные сотрудники</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Уволенных ПСЖ</label>
                        <input
                            type="text"
                            value={firedPSJ}
                            onChange={(e) => setFiredPSJ(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Уволенных с ОЧС</label>
                        <input
                            type="text"
                            value={firedOCS}
                            onChange={(e) => setFiredOCS(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Общее кол-во уволенных</label>
                        <input
                            type="text"
                            value={totalFired}
                            onChange={(e) => setTotalFired(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Кол-во принятых</label>
                        <input
                            type="text"
                            value={totalHired}
                            onChange={(e) => setTotalHired(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                </div>
            </div>

            {/* 4. Количество сотрудников */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">4. Количество сотрудников на момент отчета</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Первые ранги</label>
                        <input
                            type="text"
                            value={firstRanks}
                            onChange={(e) => setFirstRanks(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Средний состав</label>
                        <input
                            type="text"
                            value={middleStaff}
                            onChange={(e) => setMiddleStaff(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Старший состав</label>
                        <input
                            type="text"
                            value={seniorStaff}
                            onChange={(e) => setSeniorStaff(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Руководящий состав (с учетом лидера)</label>
                        <input
                            type="text"
                            value={managementStaff}
                            onChange={(e) => setManagementStaff(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Общее количество сотрудников</label>
                        <input
                            type="text"
                            value={totalStaff}
                            onChange={(e) => setTotalStaff(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                </div>
            </div>

            {/* 5. Обзвоны */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">5. Обзвоны и принятые в старший состав</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Количество обзвонов за неделю</label>
                        <input
                            type="text"
                            value={callsPerWeek}
                            onChange={(e) => setCallsPerWeek(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Количество принятых</label>
                        <input
                            type="text"
                            value={callsAccepted}
                            onChange={(e) => setCallsAccepted(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                </div>
            </div>

            {/* 6. Кадровые перестановки */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">6. Кадровые перестановки в старшем составе</h3>
                <textarea
                    value={staffChanges}
                    onChange={(e) => setStaffChanges(e.target.value)}
                    placeholder="Никнеймы, отделы, повышения, понижения (или '-' если нет)"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
            </div>

            {/* 7. Выговоры */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">7. Выданные выговоры</h3>
                {warnings.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.nickname}
                            onChange={(e) => handleItemChange(setWarnings, warnings, index, 'nickname', e.target.value)}
                            placeholder="Nick_Name"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={item.reason}
                                onChange={(e) => handleItemChange(setWarnings, warnings, index, 'reason', e.target.value)}
                                placeholder="Причина выговора"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            />
                            <button
                                onClick={() => handleRemoveItem(setWarnings, warnings, index)}
                                className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setWarnings, warnings, { nickname: '', reason: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить выговор
                </button>
            </div>

            {/* 8. Фонд неустоек */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">8. Фонд неустоек</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Получено</label>
                        <input
                            type="text"
                            value={fundReceived}
                            onChange={(e) => setFundReceived(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Выплачено</label>
                        <input
                            type="text"
                            value={fundPaid}
                            onChange={(e) => setFundPaid(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Остаток</label>
                        <input
                            type="text"
                            value={fundBalance}
                            onChange={(e) => setFundBalance(e.target.value)}
                            placeholder="xx"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>
                </div>
            </div>

            {/* 9. Лекции/тренировки */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">9. Лекции, тренировки, RP мероприятия</h3>
                {lectures.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(setLectures, lectures, index, 'name', e.target.value)}
                            placeholder="Название"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange(setLectures, lectures, index, 'link', e.target.value)}
                                placeholder="Ссылка"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            />
                            <button
                                onClick={() => handleRemoveItem(setLectures, lectures, index)}
                                className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setLectures, lectures, { name: '', link: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить лекцию/тренировку
                </button>
            </div>

            {/* 10. Мероприятия от филиалов */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">10. Мероприятия от всех филиалов организации</h3>
                {branchEvents.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(setBranchEvents, branchEvents, index, 'name', e.target.value)}
                            placeholder="Название"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange(setBranchEvents, branchEvents, index, 'link', e.target.value)}
                                placeholder="Ссылка"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            />
                            <button
                                onClick={() => handleRemoveItem(setBranchEvents, branchEvents, index)}
                                className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setBranchEvents, branchEvents, { name: '', link: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить мероприятие
                </button>
            </div>

            {/* 11. Межфракционные мероприятия */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">11. Межфракционные мероприятия (с участием лидера)</h3>
                {interfactionEvents.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(setInterfactionEvents, interfactionEvents, index, 'name', e.target.value)}
                            placeholder="Название"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={item.link}
                                onChange={(e) => handleItemChange(setInterfactionEvents, interfactionEvents, index, 'link', e.target.value)}
                                placeholder="Ссылка"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            />
                            <button
                                onClick={() => handleRemoveItem(setInterfactionEvents, interfactionEvents, index)}
                                className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setInterfactionEvents, interfactionEvents, { name: '', link: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить мероприятие
                </button>
            </div>

            {/* 12. Оценка старшего состава */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">12. Оценка работы старшего состава</h3>
                {staffEvaluations.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.nickname}
                            onChange={(e) => handleItemChange(setStaffEvaluations, staffEvaluations, index, 'nickname', e.target.value)}
                            placeholder="Nick_Name"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <input
                            type="text"
                            value={item.rating}
                            onChange={(e) => handleItemChange(setStaffEvaluations, staffEvaluations, index, 'rating', e.target.value)}
                            placeholder="8/10"
                            className="px-3 py-2 border border-input rounded-md bg-background"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={item.comment}
                                onChange={(e) => handleItemChange(setStaffEvaluations, staffEvaluations, index, 'comment', e.target.value)}
                                placeholder="Комментарий"
                                className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            />
                            <button
                                onClick={() => handleRemoveItem(setStaffEvaluations, staffEvaluations, index)}
                                className="px-3 py-2 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500/30"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => handleAddItem(setStaffEvaluations, staffEvaluations, { nickname: '', rating: '', comment: '' })}
                    className="mt-2 px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30"
                >
                    + Добавить оценку
                </button>
            </div>

            {/* Кнопка копирования */}
            <div className="modern-card p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Готово к копированию</h3>
                        <p className="text-sm text-muted-foreground">Нажмите кнопку, чтобы скопировать форматированный отчет</p>
                    </div>
                    <button
                        onClick={copyReport}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
                    >
                        📋 Скопировать отчет
                    </button>
                </div>
            </div>

            {/* Предпросмотр отчета */}
            <div className="modern-card p-6">
                <h3 className="text-lg font-semibold mb-4">Предпросмотр отчета</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                    {generateReport()}
                </pre>
            </div>
        </div>
    );
};

export default LeaderReportGenerator;
