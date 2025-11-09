import { CityData } from '../types';

// Функции для подсчета итогов
export const calculateTotalInterviews = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => 
        sum + city.parsedData.interviews.filter(i => i.link).length, 0
    );
};

export const calculateTotalHired = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => sum + city.parsedData.totalHired, 0);
};

export const calculateTotalWarnings = (cities: CityData[]): number => {
    return cities.reduce((sum, city) => sum + city.parsedData.warnings.length, 0);
};

// Функция генерации отчета
export const generateReport = (
    gsNickname: string,
    organization: string,
    dateFrom: string,
    dateTo: string,
    cities: CityData[],
    grpEvents: string,
    generalInfo: string
): string => {
    const sections: string[] = [];
    
    // 1) Заголовок
    sections.push(`1) Отчёт от ГС ${gsNickname || 'Nick_Name'} ${organization} с ${dateFrom || 'xx.xx.2025'} по ${dateTo || 'xx.xx.2025'}.\n`);
    
    // 2) Собеседования
    sections.push(`2) Количество проведенных собеседований на сервере.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.interviews.length > 0) {
            city.parsedData.interviews.forEach(interview => {
                if (interview.link) {
                    sections.push(interview.link);
                }
            });
        } else {
            sections.push('-----');
        }
        sections.push('');
    });
    const totalInterviews = calculateTotalInterviews(cities);
    sections.push(`Всего: ${totalInterviews}\n`);
    
    // 3) Принятые и уволенные
    sections.push(`3) Количество принятых и уволенных (включая ПСЖ) сотрудников во фракции.\n`);
    sections.push(`Количество принятых:`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: ${city.parsedData.totalHired}`);
    });
    sections.push('');
    sections.push(`Количество уволенных ПСЖ:`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: ${city.parsedData.firedPSJ}`);
    });
    sections.push('');
    
    // 4) Уволенные с ОЧС
    sections.push(`4) Количество уволенных сотрудников с внесением в ОЧС, качество этих внесений и количество необоснованных (при наличии).\n`);
    sections.push(`Уволенных с ОЧС:`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: ${city.parsedData.firedOCS}`);
    });
    sections.push('');
    

    // 5) Состав сотрудников
    sections.push(`5) Количество сотрудников во фракции на момент сдачи отчета — первые ранги, младший состав, средний состав, старший состав, общее количество.\n`);
    cities.forEach(city => {
        const seniorStaffNum = parseInt(city.parsedData.seniorStaff || '0');
        const managementStaffNum = parseInt(city.parsedData.managementStaff || '0');
        const combinedSeniorStaff = seniorStaffNum + managementStaffNum;
        
        sections.push(`${city.name || 'Город'}:`);
        sections.push(`Младший состав - ${city.parsedData.firstRanks || '0'}`);
        sections.push(`Средний состав - ${city.parsedData.middleStaff || '0'}`);
        sections.push(`Старший состав - ${combinedSeniorStaff}`);
        sections.push(`Общее количество - ${city.parsedData.totalStaff || '0'}`);
        sections.push('');
    });
    
    // 6) Обзвоны
    sections.push(`6) Количество проведенных обзвонов и принятых сотрудников в Старший Состав.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: - Количество обзвонов ${city.parsedData.callsPerWeek} - Количество принятых сотрудников ${city.parsedData.callsAccepted}`);
    });
    sections.push('');
    
    // 7) Кадровые перестановки
    sections.push(`7) Список кадровых перестановок в старшем составе — никнеймы, отделы, повышения, понижения.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.staffChanges && city.parsedData.staffChanges.trim()) {
            sections.push(city.parsedData.staffChanges);
        } else {
            sections.push('----');
        }
        sections.push('');
    });
    
    // 8) Выговоры
    sections.push(`8) Список выданных выговоров — ранги, никнеймы, причины, количество.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.warnings.length > 0) {
            city.parsedData.warnings.forEach(warning => {
                sections.push(`${warning.nickname} - ${warning.reason}`);
            });
        } else {
            sections.push('----');
        }
        sections.push('');
    });
    
    // 9) Фонд неустоек
    sections.push(`9) Фонд неустоек — список полученных и выплаченных (от кого/кому, суммы, причины), остаток фонда на момент сдачи отчёта.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        sections.push(`Получено: ${city.parsedData.fundReceived}`);
        sections.push(`Выплата премий: ${city.parsedData.fundPaid}`);
        sections.push(`Остаток фонда: ${city.parsedData.fundBalance || '0'}`);
        sections.push('');
    });
    
    // 10) Назначение лидера
    sections.push(`10) Кадровые назначения на пост лидера — фракция, назначенный лидер, дата назначения.\n`);
    let hasAppointments = false;
    cities.forEach(city => {
        if (city.leaderAppointment && city.leaderAppointment.trim()) {
            sections.push(city.leaderAppointment);
            hasAppointments = true;
        }
    });
    if (!hasAppointments) {
        sections.push('-----');
    }
    sections.push('');
    
    // 11) Баны лидеров
    sections.push(`11) Наличие и причины банов у лидеров.`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: ${city.leaderBans || '-'}`);
    });
    sections.push('');
    
    // 12) Выговоры лидерам
    sections.push(`12) Список выданных выговоров лидерам— фракции, никнеймы, причины, количество.`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}: ${city.leaderWarnings || '-'}`);
    });
    sections.push('');
    
    // 13) Снятие лидеров
    sections.push(`13) Снятия и причины снятий лидеров. Уходы ПСЖ и причины уходов\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.leaderRemoval && city.leaderRemoval.trim()) {
            sections.push(city.leaderRemoval);
        } else {
            sections.push('-');
        }
    });
    sections.push('');
    
    // 14) Оценка работы лидеров
    sections.push(`14) Оценка работы лидеров — достоинства и недостатки в работе.\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        sections.push(city.leaderEvaluation || 'Работает отлично, недостатков нет');
        sections.push('');
    });
    
    // 15) Мероприятия, лекции, тренировки
    sections.push(`15) Список проведенных во фракции RP ситуаций, мероприятий и тому прочего.`);
    sections.push(`ЛЕКЦИИ:(Название,ссылка)\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.lectures.length > 0) {
            city.parsedData.lectures.forEach(lecture => {
                sections.push(`${lecture.name || 'Лекция'} ${lecture.link}`);
            });
        } else {
            sections.push('-----');
        }
        sections.push('');
    });
    
    sections.push(`ТРЕНИРОВКИ:(Название,ссылка)\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.trainings.length > 0) {
            city.parsedData.trainings.forEach(training => {
                sections.push(`${training.name || 'Тренировка'} ${training.link}`);
            });
        } else {
            sections.push('-----');
        }
        sections.push('');
    });
    
    sections.push(`МЕРОПРИЯТИЯ:(Название,ссылка)\n`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.events.length > 0) {
            city.parsedData.events.forEach(event => {
                sections.push(`${event.name || 'Мероприятие'} ${event.link}`);
            });
        } else {
            sections.push('-----');
        }
        sections.push('');
    });
    
    sections.push(`Мероприятия с постом:(Название,Фракция/Фракция)`);
    cities.forEach(city => {
        sections.push(`${city.name || 'Город'}:`);
        if (city.parsedData.interfactionEvents.length > 0) {
            city.parsedData.interfactionEvents.forEach(event => {
                sections.push(event.link);
            });
        } else {
            sections.push('-----');
        }
        sections.push('');
    });
    
    // 16) Мероприятия с ГРП
    sections.push(`16) Список проведенных RP ситуаций, мероприятий при непосредственном участии администрации. (ГРП)`);
    sections.push(grpEvents || '....');
    sections.push('');
    
    // 17) Общее положение дел
    sections.push(`17) Общее положение дел во фракции — изменения в работе фракции (при наличии), стабильность её работы, качество состава, трудности, с которыми пришлось столкнуться, планы на предстоящий период до сдачи следующего отчёта.`);
    sections.push(generalInfo || 'Работа хорошая, стабильная. Изменений нет.');
    
    return sections.join('\n');
};