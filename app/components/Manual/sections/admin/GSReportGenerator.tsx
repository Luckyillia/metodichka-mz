"use client"

import React, { useState } from 'react';

// Интерфейсы для типизации
interface Interview {
    link: string;
}

interface Warning {
    nickname: string;
    reason: string;
}

interface EventItem {
    name?: string;
    link: string;
}

interface ParsedData {
    interviews: Interview[];
    firedPSJ: number;
    firedOCS: number;
    totalFired: number;
    totalHired: number;
    firstRanks: string;
    middleStaff: string;
    seniorStaff: string;
    managementStaff: string;
    totalStaff: string;
    callsPerWeek: number;
    callsAccepted: number;
    staffChanges: string;
    warnings: Warning[];
    fundReceived: number;
    fundPaid: number;
    fundBalance: string;
    lectures: EventItem[];
    trainings: EventItem[];
    events: EventItem[];
    interfactionEvents: EventItem[];
    staffEvaluations: any[]; // TODO: Add proper type
}

interface CityData {
    name: string;
    leaderReports: string[];
    parsedData: ParsedData;
    leaderAppointment: string;
    leaderBans: string;
    leaderWarnings: string;
    leaderRemoval: string;
    leaderEvaluation: string;
    grpEvents: string;
}

const createEmptyParsedData = (): ParsedData => ({
    interviews: [],
    firedPSJ: 0,
    firedOCS: 0,
    totalFired: 0,
    totalHired: 0,
    firstRanks: '',
    middleStaff: '',
    seniorStaff: '',
    managementStaff: '',
    totalStaff: '',
    callsPerWeek: 0,
    callsAccepted: 0,
    staffChanges: '',
    warnings: [],
    fundReceived: 0,
    fundPaid: 0,
    fundBalance: '',
    lectures: [],
    trainings: [],
    events: [],
    interfactionEvents: [],
    staffEvaluations: []
});

const createEmptyCity = (): CityData => ({
    name: '',
    leaderReports: [''],
    parsedData: createEmptyParsedData(),
    leaderAppointment: '',
    leaderBans: '',
    leaderWarnings: '',
    leaderRemoval: '',
    leaderEvaluation: '',
    grpEvents: ''
});

// Парсер отчетов лидера
const parseLeaderReport = (text: string): ParsedData => {
    const data = createEmptyParsedData();

    // 2) Собеседования
    const interviewsSection = text.match(/2\).*?собеседований[^]*?(?=3\)|$)/si);
    if (interviewsSection) {
        const links = interviewsSection[0].match(/https?:\/\/[^\s]+/g);
        if (links) {
            links.forEach(link => {
                if (!data.interviews.some(i => i.link === link.trim())) {
                    data.interviews.push({ link: link.trim() });
                }
            });
        }
    }

    // 3) Принятые/Уволенные
    const hiredMatch = text.match(/Кол-во принятых\s*-\s*(\d+)/i);
    if (hiredMatch) data.totalHired = parseInt(hiredMatch[1]) || 0;

    const firedPSJMatch = text.match(/Кол-во уволенных ПСЖ\s*-\s*(\d+)/i);
    if (firedPSJMatch) data.firedPSJ = parseInt(firedPSJMatch[1]) || 0;

    const firedOCSMatch = text.match(/Кол-во уволенных с ОЧС\s*-\s*(\d+)/i);
    if (firedOCSMatch) data.firedOCS = parseInt(firedOCSMatch[1]) || 0;

    const totalFiredMatch = text.match(/Общее кол-во уволенных\s*-\s*(\d+)/i);
    if (totalFiredMatch) data.totalFired = parseInt(totalFiredMatch[1]) || 0;

    // 4) Количество сотрудников
    const firstRanksMatch = text.match(/Первые ранги\s*-\s*(\d+)/i);
    if (firstRanksMatch) data.firstRanks = firstRanksMatch[1];

    const middleStaffMatch = text.match(/Средний состав\s*-\s*(\d+)/i);
    if (middleStaffMatch) data.middleStaff = middleStaffMatch[1];

    const seniorStaffMatch = text.match(/Старший состав\s*-\s*(\d+)/i);
    if (seniorStaffMatch) data.seniorStaff = seniorStaffMatch[1];

    const managementMatch = text.match(/Руководящий состав\s*-\s*(\d+)/i);
    if (managementMatch) data.managementStaff = managementMatch[1];

    const totalStaffMatch = text.match(/Общее количество сотрудников\s*-\s*(\d+)/i);
    if (totalStaffMatch) data.totalStaff = totalStaffMatch[1];

    // 5) Обзвоны - используем контекст для точного парсинга
    const callsSection = text.match(/5\).*?обзвонов[^]*?(?=6\)|$)/);
    if (callsSection) {
        const callsMatch = callsSection[0].match(/Количество обзвонов за неделю\s*-\s*(\d+)/i);
        if (callsMatch) data.callsPerWeek = parseInt(callsMatch[1]) || 0;

        const callsAcceptedMatch = callsSection[0].match(/Количество принятых\s*-\s*(\d+)/i);
        if (callsAcceptedMatch) data.callsAccepted = parseInt(callsAcceptedMatch[1]) || 0;
    }

    // 7) Кадровые перестановки
    const staffChangesSection = text.match(/6\).*?перестановок[^]*?(?=7\)|$)/s);
    if (staffChangesSection) {
        const content = staffChangesSection[0].split('\n').slice(1).join('\n').trim();
        if (content && content !== '-') {
            data.staffChanges = content;
        }
    }

    // 8) Выговоры
    const warningsSection = text.match(/7\).*?выговоров[^]*?(?=8\)|$)/s);
    if (warningsSection) {
        const warningLines = warningsSection[0].split('\n').slice(1);
        warningLines.forEach(line => {
            const match = line.match(/(.+?)\s*-\s*(.+)/);
            if (match) {
                data.warnings.push({ nickname: match[1].trim(), reason: match[2].trim() });
            }
        });
    }

    // 9) Фонд неустоек
    const fundReceivedMatch = text.match(/Получено\s*-\s*(\d+)/i);
    if (fundReceivedMatch) data.fundReceived = parseInt(fundReceivedMatch[1]) || 0;

    const fundPaidMatch = text.match(/Выплачено\s*-\s*(\d+)/i);
    if (fundPaidMatch) data.fundPaid = parseInt(fundPaidMatch[1]) || 0;

    const fundBalanceMatch = text.match(/Остаток\s*-\s*(\d+)/i);
    if (fundBalanceMatch) data.fundBalance = fundBalanceMatch[1];

    // Лекции - ИСПРАВЛЕННЫЙ ПАРСИНГ
    const lecturesSection = text.match(/Лекции:[^]*?(?=Тренировки:|Мероприятия:|10\)|$)/);
    if (lecturesSection) {
        const lectureLines = lecturesSection[0].split('\n').slice(1);
        lectureLines.forEach(line => {
            const match = line.match(/\d+\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/);
            if (match) {
                const name = match[1].trim();
                const link = match[2].trim();
                if (!data.lectures.some(l => l.link === link)) {
                    data.lectures.push({ name, link });
                }
            }
        });
    }

    // Тренировки - ИСПРАВЛЕННЫЙ ПАРСИНГ
    const trainingsSection = text.match(/Тренировки:[^]*?(?=Мероприятия:|10\)|$)/);
    if (trainingsSection) {
        const trainingLines = trainingsSection[0].split('\n').slice(1);
        trainingLines.forEach(line => {
            const match = line.match(/\d+\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/);
            if (match) {
                const name = match[1].trim();
                const link = match[2].trim();
                if (!data.trainings.some(t => t.link === link)) {
                    data.trainings.push({ name, link });
                }
            }
        });
    }

    // Мероприятия - ИСПРАВЛЕННЫЙ ПАРСИНГ (секция 9, после Тренировок)
    const eventsSection = text.match(/Мероприятия:[^]*?(?=10\)|$)/);
    if (eventsSection) {
        const eventLines = eventsSection[0].split('\n').slice(1);
        eventLines.forEach(line => {
            const match = line.match(/\d+\.\s*(.+?)\s*-\s*(https?:\/\/[^\s]+)/);
            if (match) {
                const name = match[1].trim();
                const link = match[2].trim();
                if (!data.events.some(e => e.link === link)) {
                    data.events.push({ name, link });
                }
            }
        });
    }

    // Мероприятия от филиалов (секция 10)
    const branchEventsSection = text.match(/10\).*?филиалов[^]*?(?=11\)|$)/);
    if (branchEventsSection) {
        const eventLines = branchEventsSection[0].split('\n').slice(1);
        eventLines.forEach(line => {
            const match = line.match(/\d+\.\s*(https?:\/\/[^\s]+)/);
            if (match) {
                const link = match[1].trim();
                // Мероприятия от филиалов добавляем в отдельный массив или в events
                // Пока добавим в events с пометкой
                if (!data.events.some(e => e.link === link)) {
                    data.events.push({ name: 'Мероприятие от филиала', link });
                }
            }
        });
    }

    // Межфракционные мероприятия (секция 11)
    const interfactionSection = text.match(/11\).*?межфракционных[^]*?(?=12\)|$)/);
    if (interfactionSection) {
        const eventLines = interfactionSection[0].split('\n').slice(1);
        eventLines.forEach(line => {
            const match = line.match(/\d+\.\s*(https?:\/\/[^\s]+)/);
            if (match) {
                const link = match[1].trim();
                if (!data.interfactionEvents.some(e => e.link === link)) {
                    data.interfactionEvents.push({ link });
                }
            }
        });
    }

    // Оценка старшего состава
    const evaluationsSection = text.match(/12\).*?старшего состава[^]*?$/);
    if (evaluationsSection) {
        const evalLines = evaluationsSection[0].split('\n').slice(1);
        evalLines.forEach(line => {
            const match = line.match(/(.+?)\s*-\s*(\d+\/\d+)\s*(.+)/);
            if (match) {
                data.staffEvaluations.push({ 
                    nickname: match[1].trim(), 
                    rating: match[2].trim(), 
                    comment: match[3].trim() 
                });
            }
        });
    }

    return data;
};

// Функция для объединения данных
const mergeData = (existing: ParsedData, newData: ParsedData): ParsedData => {
    return {
        interviews: [...existing.interviews, ...newData.interviews].filter((item, index, self) => 
            index === self.findIndex(t => t.link === item.link)
        ),
        firedPSJ: existing.firedPSJ + newData.firedPSJ,
        firedOCS: existing.firedOCS + newData.firedOCS,
        totalFired: existing.totalFired + newData.totalFired,
        totalHired: existing.totalHired + newData.totalHired,
        firstRanks: newData.firstRanks || existing.firstRanks,
        middleStaff: newData.middleStaff || existing.middleStaff,
        seniorStaff: newData.seniorStaff || existing.seniorStaff,
        managementStaff: newData.managementStaff || existing.managementStaff,
        totalStaff: newData.totalStaff || existing.totalStaff,
        callsPerWeek: existing.callsPerWeek + newData.callsPerWeek,
        callsAccepted: existing.callsAccepted + newData.callsAccepted,
        staffChanges: [existing.staffChanges, newData.staffChanges].filter(Boolean).join('\n'),
        warnings: [...existing.warnings, ...newData.warnings],
        fundReceived: existing.fundReceived + newData.fundReceived,
        fundPaid: existing.fundPaid + newData.fundPaid,
        fundBalance: newData.fundBalance || existing.fundBalance,
        lectures: [...existing.lectures, ...newData.lectures].filter((item, index, self) => 
            index === self.findIndex(t => t.link === item.link)
        ),
        trainings: [...existing.trainings, ...newData.trainings].filter((item, index, self) => 
            index === self.findIndex(t => t.link === item.link)
        ),
        events: [...existing.events, ...newData.events].filter((item, index, self) => 
            index === self.findIndex(t => t.link === item.link)
        ),
        interfactionEvents: [...existing.interfactionEvents, ...newData.interfactionEvents].filter((item, index, self) => 
            index === self.findIndex(t => t.link === item.link)
        ),
        staffEvaluations: (() => {
            const combined = [...existing.staffEvaluations];
            newData.staffEvaluations.forEach(newEval => {
                const existingIndex = combined.findIndex(e => e.nickname === newEval.nickname);
                if (existingIndex >= 0) {
                    combined[existingIndex] = newEval;
                } else {
                    combined.push(newEval);
                }
            });
            return combined;
        })()
    };
};

// Компоненты для списков
const ListItemEditor = ({ items, onAdd, onRemove, onChange, itemType, cityIndex, field }) => {
    const getTemplate = () => {
        switch (itemType) {
            case 'link':
                return { link: '' };
            case 'nameLink':
                return { name: '', link: '' };
            case 'warning':
                return { nickname: '', reason: '' };
            default:
                return {};
        }
    };

    return (
        <div>
            {items.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            {itemType === 'link' && (
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                />
                            )}
                            {itemType === 'nameLink' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'name', e.target.value)}
                                        placeholder="Название"
                                        className="flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                    />
                                    <input
                                        type="text"
                                        value={item.link}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'link', e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                    />
                                </>
                            )}
                            {itemType === 'warning' && (
                                <>
                                    <input
                                        type="text"
                                        value={item.nickname}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'nickname', e.target.value)}
                                        placeholder="Nick_Name"
                                        className="flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                    />
                                    <input
                                        type="text"
                                        value={item.reason}
                                        onChange={(e) => onChange(cityIndex, field, idx, 'reason', e.target.value)}
                                        placeholder="Причина"
                                        className="flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                                    />
                                </>
                            )}
                            <button
                                onClick={() => onRemove(cityIndex, field, idx)}
                                className="px-2 py-2 bg-gray-800/70 text-gray-200 rounded-lg hover:bg-gray-700/70 transition-colors text-xs border border-gray-600/50 flex-shrink-0 hover:border-gray-500/50"
                                title="Удалить"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 py-2">Нет данных</p>
            )}
            <button
                onClick={() => onAdd(cityIndex, field, getTemplate())}
                className="mt-2 px-3 py-1.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#4ade80] transition-colors text-xs border border-[#4ade80]/30 font-medium"
            >
                + Добавить
            </button>
        </div>
    );
};

const GSReportGenerator = () => {
    const [gsNickname, setGsNickname] = useState('');
    const [organization, setOrganization] = useState('МЗ');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [cities, setCities] = useState([
        { ...createEmptyCity(), name: 'ЦГБ-П' },
        { ...createEmptyCity(), name: 'ОКБ-М' },
        { ...createEmptyCity(), name: 'ЦГБ-Н' }
    ]);
    const [generalInfo, setGeneralInfo] = useState('');
    const [grpEvents, setGrpEvents] = useState('');

    const parseAndMergeLeaderReport = (text: string, cityIndex: number, reportIndex: number) => {
        const newCities = [...cities];
        const parsedData = parseLeaderReport(text);
        newCities[cityIndex].parsedData = mergeData(newCities[cityIndex].parsedData, parsedData);
        newCities[cityIndex].leaderReports[reportIndex] = text; // ИСПРАВЛЕНИЕ: сохраняем текст
        setCities(newCities);
    };

    const addLeaderReportField = (cityIndex: number) => {
        const newCities = [...cities];
        newCities[cityIndex].leaderReports.push('');
        setCities(newCities);
    };

    const removeLeaderReportField = (cityIndex: number, reportIndex: number) => {
        const newCities = [...cities];
        if (newCities[cityIndex].leaderReports.length > 1) {
            newCities[cityIndex].leaderReports.splice(reportIndex, 1);
        }
        setCities(newCities);
    };

    const addCity = () => {
        setCities([...cities, createEmptyCity()]);
    };

    const removeCity = (index: number) => {
        if (cities.length === 1) return;
        const newCities = [...cities];
        newCities.splice(index, 1);
        setCities(newCities);
    };

    const updateCity = (cityIndex: number, field: string, value: string) => {
        const newCities = [...cities];
        newCities[cityIndex][field] = value;
        setCities(newCities);
    };

    const updateParsedData = (cityIndex: number, field: string, value: any) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData[field] = value;
        setCities(newCities);
    };

    const handleAddItem = (cityIndex: number, field: string, template: any) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData[field] = [...newCities[cityIndex].parsedData[field], template];
        setCities(newCities);
    };

    const handleRemoveItem = (cityIndex: number, field: string, itemIndex: number) => {
        const newCities = [...cities];
        if (newCities[cityIndex].parsedData[field].length <= 1) {
            newCities[cityIndex].parsedData[field] = [getTemplate()];
        } else {
            newCities[cityIndex].parsedData[field].splice(itemIndex, 1);
        }
        setCities(newCities);
    };

    const handleItemChange = (cityIndex: number, field: string, itemIndex: number, itemField: string, value: string) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData[field][itemIndex][itemField] = value;
        setCities(newCities);
    };

    const clearCityData = (cityIndex: number) => {
        const newCities = [...cities];
        newCities[cityIndex].parsedData = createEmptyParsedData();
        newCities[cityIndex].leaderReports = [''];
        setCities(newCities);
    };

    const generateReport = () => {
        let report = `Отчёт от ГС ${gsNickname || 'Nick_Name'} ${organization} с ${dateFrom || 'xx.xx.2025'} по ${dateTo || 'xx.xx.2025'}.\n\n`;

        report += `2) Количество проведенных собеседований на сервере.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasInterviews = city.parsedData.interviews.length > 0;
            if (hasInterviews) {
                city.parsedData.interviews.forEach((item) => {
                    if (item.link) report += `${item.link}\n`;
                });
            } else {
                report += `-\n`;
            }
            report += `\n`;
        });
        const totalInterviews = cities.reduce((sum, city) => 
            sum + city.parsedData.interviews.filter(i => i.link).length, 0);
        report += `Всего: ${totalInterviews}\n\n`;

        report += `3) Количество принятых и уволенных (включая ПСЖ) сотрудников во фракции.\n\n`;
        report += `Количество принятых:\n`;
        cities.forEach(city => {
            report += `${city.name}: ${city.parsedData.totalHired || '0'}\n`;
        });
        report += `\nКоличество уволенных ПСЖ:\n`;
        cities.forEach(city => {
            report += `${city.name}: ${city.parsedData.firedPSJ || '0'}\n`;
        });
        report += `\n`;

        report += `4) Количество уволенных сотрудников с внесением в ОЧС, качество этих внесений и количество необоснованных (при наличии).\n\n`;
        report += `Уволенных с ОЧС:\n`;
        cities.forEach(city => {
            report += `${city.name}: ${city.parsedData.firedOCS || '0'}\n`;
        });
        report += `\n`;

        report += `5) Количество сотрудников во фракции на момент сдачи отчета – первые ранги, младший состав, средний состав, старший состав, общее количество.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            report += `Младший состав - ${city.parsedData.firstRanks || '0'}\n`;
            report += `Средний состав - ${city.parsedData.middleStaff || '0'}\n`;
            report += `Старший состав - ${city.parsedData.seniorStaff || '0'}\n`;
            report += `Руководящий состав - ${city.parsedData.managementStaff || '0'}\n`;
            report += `Общее количество - ${city.parsedData.totalStaff || '0'}\n\n`;
        });

        report += `6) Количество проведенных обзвонов и принятых сотрудников в Старший Состав.\n\n`;
        cities.forEach(city => {
            report += `${city.name}: - Количество обзвонов ${city.parsedData.callsPerWeek || '0'} - Количество принятых сотрудников ${city.parsedData.callsAccepted || '0'}\n`;
        });
        report += `\n`;

        report += `7) Список кадровых перестановок в старшем составе – никнеймы, отделы, повышения, понижения.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            report += `${city.parsedData.staffChanges || '----'}\n\n`;
        });

        report += `8) Список выданных выговоров – ранги, никнеймы, причины, количество.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasWarnings = city.parsedData.warnings.length > 0;
            if (hasWarnings) {
                city.parsedData.warnings.forEach((item) => {
                    if (item.nickname || item.reason) {
                        report += `${item.nickname || 'Nick_Name'} - ${item.reason || 'причина'}\n`;
                    }
                });
            } else {
                report += `----\n`;
            }
            report += `\n`;
        });

        report += `9) Фонд неустоек – список полученных и выплаченных (от кого/кому, суммы, причины), остаток фонда на момент сдачи отчёта.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            report += `Получено: ${city.parsedData.fundReceived || '0'}\n`;
            report += `Выплата премий: ${city.parsedData.fundPaid || '0'}\n`;
            report += `Остаток фонда: ${city.parsedData.fundBalance || '0'}\n\n`;
        });

        report += `10) Кадровые назначения на пост лидера – фракция, назначенный лидер, дата назначения.\n\n`;
        cities.forEach(city => {
            if (city.leaderAppointment) {
                report += `${city.leaderAppointment}\n`;
            }
        });
        report += `\n`;

        report += `11) Наличие и причины банов у лидеров.\n`;
        cities.forEach(city => {
            report += `${city.name}: ${city.leaderBans || '-'}\n`;
        });
        report += `\n`;

        report += `12) Список выданных выговоров лидерам– фракции, никнеймы, причины, количество.\n`;
        cities.forEach(city => {
            report += `${city.name}: ${city.leaderWarnings || '-'}\n`;
        });
        report += `\n`;

        report += `13) Снятия и причины снятий лидеров. Уходы ПСЖ и причины уходов\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            report += `${city.leaderRemoval || '-'}\n`;
        });
        report += `\n`;

        report += `14) Оценка работы лидеров – достоинства и недостатки в работе.\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            report += `${city.leaderEvaluation || 'Работает отлично, недостатков нет'}\n\n`;
        });

        report += `15) Список проведенных во фракции RP ситуаций, мероприятий и тому прочего.\n`;
        report += `ЛЕКЦИИ:(Название,ссылка)\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasLectures = city.parsedData.lectures.length > 0;
            if (hasLectures) {
                city.parsedData.lectures.forEach((item) => {
                    if (item.name || item.link) {
                        report += `Лекция ${item.name || 'Название'} ${item.link || 'ссылка'}\n`;
                    }
                });
            } else {
                report += `-\n`;
            }
            report += `\n`;
        });

        report += `ТРЕНИРОВКИ:(Название,ссылка)\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasTrainings = city.parsedData.trainings.length > 0;
            if (hasTrainings) {
                city.parsedData.trainings.forEach((item) => {
                    if (item.name || item.link) {
                        report += `Тренировка ${item.name || 'Название'} ${item.link || 'ссылка'}\n`;
                    }
                });
            } else {
                report += `-\n`;
            }
            report += `\n`;
        });

        report += `МЕРОПРИЯТИЯ:(Название,ссылка)\n\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasEvents = city.parsedData.events.length > 0;
            if (hasEvents) {
                city.parsedData.events.forEach((item) => {
                    if (item.name || item.link) {
                        report += `Мероприятие ${item.name || 'Название'} ${item.link || 'ссылка'}\n`;
                    }
                });
            } else {
                report += `-\n`;
            }
            report += `\n`;
        });

        report += `Мероприятия с постом:(Название,Фракция/Фракция)\n`;
        cities.forEach(city => {
            report += `${city.name}:\n`;
            const hasInterfactionEvents = city.parsedData.interfactionEvents.length > 0;
            if (hasInterfactionEvents) {
                city.parsedData.interfactionEvents.forEach((item) => {
                    if (item.link) {
                        report += `${item.link}\n`;
                    }
                });
            } else {
                report += `-----\n`;
            }
        });
        report += `\n`;

        report += `16) Список проведенных RP ситуаций, мероприятий при непосредственном участии администрации. (ГРП)\n`;
        report += `${grpEvents || '....'}\n\n`;

        report += `17) Общее положение дел во фракции – изменения в работе фракции (при наличии), стабильность её работы, качество состава, трудности, с которыми пришлось столкнуться, планы на предстоящий период до сдачи следующего отчёта.\n`;
        report += `${generalInfo || 'Работа хорошая, стабильная. Изменений нет.'}\n`;

        return report;
    };

    const copyReport = () => {
        const report = generateReport();
        navigator.clipboard.writeText(report);
        alert('Отчет ГС скопирован в буфер обмена!');
    };

    return (
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Заголовок */}
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

                {/* Основная информация ГС */}
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600/40 pb-2">Основная информация</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Никнейм ГС</label>
                            <input
                                type="text"
                                value={gsNickname}
                                onChange={(e) => setGsNickname(e.target.value)}
                                placeholder="Polter_Sokirovskiy"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Организация</label>
                            <input
                                type="text"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                placeholder="МЗ"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Период с</label>
                            <input
                                type="text"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="25.09.25"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Период по</label>
                            <input
                                type="text"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="25.10.25"
                                className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Отчеты по городам */}
                {cities.map((city, cityIndex) => (
                    <div key={cityIndex} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-2xl">🏥</span>
                                    {city.name || `Город #${cityIndex + 1}`}
                                </h2>
                                <p className="text-sm text-gray-300 mt-1">
                                    📋 Вставлено отчетов: {city.leaderReports.filter(r => r.trim()).length} | 
                                    📊 Собеседований: {city.parsedData.interviews.length} | 
                                    👥 Принято: {city.parsedData.totalHired} | 
                                    ⚠️ Выговоров: {city.parsedData.warnings.length}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => clearCityData(cityIndex)}
                                    className="px-4 py-2 bg-gray-800/70 text-gray-200 rounded-lg hover:bg-gray-700/70 transition-colors border border-gray-600/50 text-sm hover:border-gray-500/50"
                                    title="Очистить все данные и начать заново"
                                >
                                    🔄 Сброс
                                </button>
                                {cities.length > 1 && (
                                    <button
                                        onClick={() => removeCity(cityIndex)}
                                        className="px-4 py-2 bg-gray-800/70 text-gray-200 rounded-lg hover:bg-gray-700/70 transition-colors border border-gray-600/50 hover:border-gray-500/50"
                                    >
                                        ✕ Удалить город
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Название города */}
                            <div>
                                <label className="block text-sm font-medium text-purple-200 mb-2">Название города</label>
                                <input
                                    type="text"
                                    value={city.name}
                                    onChange={(e) => updateCity(cityIndex, 'name', e.target.value)}
                                    placeholder="ЦДБ-П"
                                    className="w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            {/* Поля для вставки отчетов лидера */}
                            <div className="bg-gradient-to-r from-gray-800/30 to-gray-800/10 border border-gray-700/40 rounded-xl p-4">
                                <h4 className="text-lg font-semibold text-blue-300 mb-3">📋 Вставьте отчеты лидера (за разные недели)</h4>
                                {city.leaderReports.map((report, reportIndex) => {
                                    const isParsed = report.trim().length > 50;
                                    return (
                                        <div key={reportIndex} className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-sm font-medium text-blue-200 flex items-center gap-2">
                                                    Отчет #{reportIndex + 1}
                                                    {isParsed && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">✓ Распарсен</span>}
                                                </label>
                                                {city.leaderReports.length > 1 && (
                                                    <button
                                                        onClick={() => removeLeaderReportField(cityIndex, reportIndex)}
                                                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 text-sm border border-red-500/30"
                                                    >
                                                        ✕ Удалить
                                                    </button>
                                                )}
                                            </div>
                                            <textarea
                                                value={report}
                                                onChange={(e) => {
                                                    const newCities = [...cities];
                                                    newCities[cityIndex].leaderReports[reportIndex] = e.target.value;
                                                    setCities(newCities);
                                                }}
                                                disabled={isParsed}
                                                placeholder={`Вставьте сюда отчет лидера за неделю ${reportIndex + 1}. Данные автоматически суммируются с другими отчетами.`}
                                                rows={10}
                                                className={`w-full px-4 py-3 border rounded-lg font-mono text-sm transition-all ${
                                                    isParsed 
                                                        ? 'bg-white/5 border-green-500/30 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-white/5 border-blue-500/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                }`}
                                                onPaste={(e) => {
                                                    if (isParsed) return;
                                                    const pastedText = e.clipboardData.getData('text');
                                                    if (!pastedText.trim()) return;
                                                
                                                    const newCities = [...cities];
                                                    newCities[cityIndex].leaderReports[reportIndex] = pastedText;
                                                    setCities(newCities);
                                                
                                                    parseAndMergeLeaderReport(pastedText, cityIndex, reportIndex);
                                                    e.preventDefault();
                                                }}
                                            />
                                            {isParsed && (
                                                <button
                                                    onClick={() => {
                                                        const newCities = [...cities];
                                                        newCities[cityIndex].leaderReports[reportIndex] = '';
                                                        setCities(newCities);
                                                    }}
                                                    className="mt-2 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 text-xs border border-orange-500/30"
                                                >
                                                    🔓 Разблокировать для редактирования
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={() => addLeaderReportField(cityIndex)}
                                    className="w-full py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors font-semibold border border-blue-500/30"
                                >
                                    ➕ Добавить еще один отчет лидера
                                </button>
                                <p className="text-xs text-blue-300 mt-3 leading-relaxed">
                                    💡 Совет: Вставляйте каждый недельный отчет лидера в отдельное поле. Программа автоматически:
                                    <br />• Суммирует принятых/уволенных/обзвоны/фонды
                                    <br />• Объединяет собеседования/лекции/мероприятия без дубликатов
                                    <br />• Берет последние значения состава сотрудников
                                    <br />• После вставки поле блокируется для предотвращения случайных изменений
                                </p>
                            </div>

                            {/* Распарсенные данные */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                <h4 className="text-lg font-semibold text-green-300 mb-4">✅ Автоматически извлеченные данные</h4>
                                
                                <div className="space-y-4">
                                    {/* Статистика */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                                            <div className="text-xs text-purple-300">Принято</div>
                                            <div className="text-xl font-bold text-white">{city.parsedData.totalHired}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                                            <div className="text-xs text-purple-300">Уволено ПСЖ</div>
                                            <div className="text-xl font-bold text-white">{city.parsedData.firedPSJ}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                                            <div className="text-xs text-purple-300">Обзвонов</div>
                                            <div className="text-xl font-bold text-white">{city.parsedData.callsPerWeek}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                                            <div className="text-xs text-purple-300">Выговоров</div>
                                            <div className="text-xl font-bold text-white">{city.parsedData.warnings.length}</div>
                                        </div>
                                    </div>

                                    {/* Состав */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        <div>
                                            <label className="block text-xs text-purple-300 mb-1">Младший</label>
                                            <input
                                                type="text"
                                                value={city.parsedData.firstRanks}
                                                onChange={(e) => updateParsedData(cityIndex, 'firstRanks', e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-purple-300 mb-1">Средний</label>
                                            <input
                                                type="text"
                                                value={city.parsedData.middleStaff}
                                                onChange={(e) => updateParsedData(cityIndex, 'middleStaff', e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-purple-300 mb-1">Старший</label>
                                            <input
                                                type="text"
                                                value={city.parsedData.seniorStaff}
                                                onChange={(e) => updateParsedData(cityIndex, 'seniorStaff', e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-purple-300 mb-1">Руководящий</label>
                                            <input
                                                type="text"
                                                value={city.parsedData.managementStaff}
                                                onChange={(e) => updateParsedData(cityIndex, 'managementStaff', e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-purple-300 mb-1">Всего</label>
                                            <input
                                                type="text"
                                                value={city.parsedData.totalStaff}
                                                onChange={(e) => updateParsedData(cityIndex, 'totalStaff', e.target.value)}
                                                className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Кадровые перестановки */}
                                    <div>
                                        <label className="block text-sm text-purple-300 mb-2">Кадровые перестановки</label>
                                        <textarea
                                            value={city.parsedData.staffChanges}
                                            onChange={(e) => updateParsedData(cityIndex, 'staffChanges', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white/5 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Собеседования */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            📝 Собеседования ({city.parsedData.interviews.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.interviews}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="link"
                                            cityIndex={cityIndex}
                                            field="interviews"
                                        />
                                    </div>

                                    {/* Лекции */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            📚 Лекции ({city.parsedData.lectures.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.lectures}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="nameLink"
                                            cityIndex={cityIndex}
                                            field="lectures"
                                        />
                                    </div>

                                    {/* Тренировки */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            🏋️ Тренировки ({city.parsedData.trainings.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.trainings}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="nameLink"
                                            cityIndex={cityIndex}
                                            field="trainings"
                                        />
                                    </div>

                                    {/* Мероприятия */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            🎉 Мероприятия ({city.parsedData.events.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.events}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="nameLink"
                                            cityIndex={cityIndex}
                                            field="events"
                                        />
                                    </div>

                                    {/* Межфракционные мероприятия */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            🤝 Мероприятия с постом ({city.parsedData.interfactionEvents.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.interfactionEvents}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="link"
                                            cityIndex={cityIndex}
                                            field="interfactionEvents"
                                        />
                                    </div>

                                    {/* Выговоры */}
                                    <div>
                                        <label className="block text-sm font-medium text-purple-300 mb-2">
                                            ⚠️ Выговоры ({city.parsedData.warnings.length})
                                        </label>
                                        <ListItemEditor
                                            items={city.parsedData.warnings}
                                            onAdd={handleAddItem}
                                            onRemove={handleRemoveItem}
                                            onChange={handleItemChange}
                                            itemType="warning"
                                            cityIndex={cityIndex}
                                            field="warnings"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Дополнительные данные */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h4 className="text-lg font-semibold text-yellow-300 mb-4">📝 Дополнительные данные (не из отчета лидера)</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-purple-200 mb-2">Назначение лидера</label>
                                        <textarea
                                            value={city.leaderAppointment}
                                            onChange={(e) => updateCity(cityIndex, 'leaderAppointment', e.target.value)}
                                            placeholder="Nick_Name - назначен на пост лидера... Дата"
                                            rows={2}
                                            className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-purple-200 mb-2">Баны лидера</label>
                                            <input
                                                type="text"
                                                value={city.leaderBans}
                                                onChange={(e) => updateCity(cityIndex, 'leaderBans', e.target.value)}
                                                placeholder="-"
                                                className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-purple-200 mb-2">Выговоры лидеру</label>
                                            <input
                                                type="text"
                                                value={city.leaderWarnings}
                                                onChange={(e) => updateCity(cityIndex, 'leaderWarnings', e.target.value)}
                                                placeholder="-"
                                                className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-purple-200 mb-2">Снятие лидера</label>
                                        <textarea
                                            value={city.leaderRemoval}
                                            onChange={(e) => updateCity(cityIndex, 'leaderRemoval', e.target.value)}
                                            placeholder="Nick_Name - снят по причине..."
                                            rows={2}
                                            className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-purple-200 mb-2">Оценка работы лидера</label>
                                        <textarea
                                            value={city.leaderEvaluation}
                                            onChange={(e) => updateCity(cityIndex, 'leaderEvaluation', e.target.value)}
                                            placeholder="Работает отлично, недостатков нет"
                                            rows={2}
                                            className="w-full px-4 py-2 bg-white/5 border border-yellow-500/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Кнопка добавления города */}
                <button
                    onClick={addCity}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold text-lg shadow-lg"
                >
                    ➕ Добавить еще один город
                </button>

                {/* ГРП мероприятия */}
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">16. Мероприятия с ГРП (для всей организации)</h3>
                    <textarea
                        value={grpEvents}
                        onChange={(e) => setGrpEvents(e.target.value)}
                        placeholder="Описание мероприятий при непосредственном участии администрации (ГРП) для всех городов..."
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                </div>

                {/* Общее положение дел */}
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">17. Общее положение дел во фракции</h3>
                    <textarea
                        value={generalInfo}
                        onChange={(e) => setGeneralInfo(e.target.value)}
                        placeholder="Изменения в работе фракции, стабильность, качество состава, трудности, планы..."
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                </div>

                {/* Кнопка копирования */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-1">✅ Готово к копированию</h3>
                            <p className="text-green-200">Полный отчет ГС по всем городам сформирован</p>
                            <p className="text-sm text-green-300 mt-1">
                                Всего собеседований: {cities.reduce((sum, city) => sum + city.parsedData.interviews.length, 0)} | 
                                Принято: {cities.reduce((sum, city) => sum + city.parsedData.totalHired, 0)} | 
                                Выговоров: {cities.reduce((sum, city) => sum + city.parsedData.warnings.length, 0)}
                            </p>
                        </div>
                        <button
                            onClick={copyReport}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold text-lg shadow-lg"
                        >
                            📋 Скопировать отчет ГС
                        </button>
                    </div>
                </div>

                {/* Предпросмотр */}
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">👁️ Предпросмотр отчета</h3>
                    <pre className="bg-black/30 p-4 rounded-lg text-sm text-green-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto border border-green-500/20">
                        {generateReport()}
                    </pre>
                </div>
            </div>
    );
};

export default GSReportGenerator;