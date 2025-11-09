import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { CityData } from '../types';
import { calculateTotalInterviews } from './generation.utils';

export const generateDocxReport = async (
    gsNickname: string,
    organization: string,
    dateFrom: string,
    dateTo: string,
    cities: CityData[],
    grpEvents: string,
    generalInfo: string
) => {
    const paragraphs: Paragraph[] = [];

    // Функция для добавления заголовка секции
    const addSectionHeader = (text: string) => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text, bold: true, size: 24 })],
                spacing: { before: 200, after: 100 }
            })
        );
    };

    // Функция для добавления обычного текста
    const addText = (text: string) => {
        paragraphs.push(
            new Paragraph({
                children: [new TextRun({ text, size: 22 })],
                spacing: { after: 100 }
            })
        );
    };

    // Функция для добавления пустой строки
    const addEmptyLine = () => {
        paragraphs.push(new Paragraph({ text: '' }));
    };

    // 1) Заголовок
    addSectionHeader(`1) Отчёт от ГС ${gsNickname || 'Nick_Name'} ${organization} с ${dateFrom || 'xx.xx.2025'} по ${dateTo || 'xx.xx.2025'}.`);
    addEmptyLine();

    // 2) Собеседования
    addSectionHeader(`2) Количество проведенных собеседований на сервере.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.interviews.length > 0) {
            city.parsedData.interviews.forEach(interview => {
                if (interview.link) {
                    addText(interview.link);
                }
            });
        } else {
            addText('-----');
        }
        addEmptyLine();
    });
    const totalInterviews = calculateTotalInterviews(cities);
    addText(`Всего: ${totalInterviews}`);
    addEmptyLine();

    // 3) Принятые и уволенные
    addSectionHeader(`3) Количество принятых и уволенных (включая ПСЖ) сотрудников во фракции.`);
    addText(`Количество принятых:`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: ${city.parsedData.totalHired}`);
    });
    addEmptyLine();
    addText(`Количество уволенных ПСЖ:`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: ${city.parsedData.firedPSJ}`);
    });
    addEmptyLine();

    // 4) Уволенные с ОЧС
    addSectionHeader(`4) Количество уволенных сотрудников с внесением в ОЧС, качество этих внесений и количество необоснованных (при наличии).`);
    addText(`Уволенных с ОЧС:`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: ${city.parsedData.firedOCS}`);
    });
    addEmptyLine();

    // 5) Состав сотрудников
    addSectionHeader(`5) Количество сотрудников во фракции на момент сдачи отчета — первые ранги, младший состав, средний состав, старший состав, общее количество.`);
    cities.forEach(city => {
        const seniorStaffNum = parseInt(city.parsedData.seniorStaff || '0');
        const managementStaffNum = parseInt(city.parsedData.managementStaff || '0');
        const combinedSeniorStaff = seniorStaffNum + managementStaffNum;
        
        addText(`${city.name || 'Город'}:`);
        addText(`Младший состав - ${city.parsedData.firstRanks || '0'}`);
        addText(`Средний состав - ${city.parsedData.middleStaff || '0'}`);
        addText(`Старший состав - ${combinedSeniorStaff}`);
        addText(`Общее количество - ${city.parsedData.totalStaff || '0'}`);
        addEmptyLine();
    });

    // 6) Обзвоны
    addSectionHeader(`6) Количество проведенных обзвонов и принятых сотрудников в Старший Состав.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: - Количество обзвонов ${city.parsedData.callsPerWeek} - Количество принятых сотрудников ${city.parsedData.callsAccepted}`);
    });
    addEmptyLine();

    // 7) Кадровые перестановки
    addSectionHeader(`7) Список кадровых перестановок в старшем составе — никнеймы, отделы, повышения, понижения.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.staffChanges && city.parsedData.staffChanges.trim()) {
            addText(city.parsedData.staffChanges);
        } else {
            addText('----');
        }
        addEmptyLine();
    });

    // 8) Выговоры
    addSectionHeader(`8) Список выданных выговоров — ранги, никнеймы, причины, количество.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.warnings.length > 0) {
            city.parsedData.warnings.forEach(warning => {
                addText(`${warning.nickname} - ${warning.reason}`);
            });
        } else {
            addText('----');
        }
        addEmptyLine();
    });

    // 9) Фонд неустоек
    addSectionHeader(`9) Фонд неустоек — список полученных и выплаченных (от кого/кому, суммы, причины), остаток фонда на момент сдачи отчёта.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        addText(`Получено: ${city.parsedData.fundReceived}`);
        addText(`Выплата премий: ${city.parsedData.fundPaid}`);
        addText(`Остаток фонда: ${city.parsedData.fundBalance || '0'}`);
        addEmptyLine();
    });

    // 10) Назначение лидера
    addSectionHeader(`10) Кадровые назначения на пост лидера — фракция, назначенный лидер, дата назначения.`);
    let hasAppointments = false;
    cities.forEach(city => {
        if (city.leaderAppointment && city.leaderAppointment.trim()) {
            addText(city.leaderAppointment);
            hasAppointments = true;
        }
    });
    if (!hasAppointments) {
        addText('-----');
    }
    addEmptyLine();

    // 11) Баны лидеров
    addSectionHeader(`11) Наличие и причины банов у лидеров.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: ${city.leaderBans || '-'}`);
    });
    addEmptyLine();

    // 12) Выговоры лидерам
    addSectionHeader(`12) Список выданных выговоров лидерам— фракции, никнеймы, причины, количество.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}: ${city.leaderWarnings || '-'}`);
    });
    addEmptyLine();

    // 13) Снятие лидеров
    addSectionHeader(`13) Снятия и причины снятий лидеров. Уходы ПСЖ и причины уходов`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.leaderRemoval && city.leaderRemoval.trim()) {
            addText(city.leaderRemoval);
        } else {
            addText('-');
        }
    });
    addEmptyLine();

    // 14) Оценка работы лидеров
    addSectionHeader(`14) Оценка работы лидеров — достоинства и недостатки в работе.`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        addText(city.leaderEvaluation || 'Работает отлично, недостатков нет');
        addEmptyLine();
    });

    // 15) Мероприятия, лекции, тренировки
    addSectionHeader(`15) Список проведенных во фракции RP ситуаций, мероприятий и тому прочего.`);
    addText(`ЛЕКЦИИ:(Название,ссылка)`);
    addEmptyLine();
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.lectures.length > 0) {
            city.parsedData.lectures.forEach(lecture => {
                addText(`${lecture.name || 'Лекция'} ${lecture.link}`);
            });
        } else {
            addText('-----');
        }
        addEmptyLine();
    });

    addText(`ТРЕНИРОВКИ:(Название,ссылка)`);
    addEmptyLine();
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.trainings.length > 0) {
            city.parsedData.trainings.forEach(training => {
                addText(`${training.name || 'Тренировка'} ${training.link}`);
            });
        } else {
            addText('-----');
        }
        addEmptyLine();
    });

    addText(`МЕРОПРИЯТИЯ:(Название,ссылка)`);
    addEmptyLine();
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.events.length > 0) {
            city.parsedData.events.forEach(event => {
                addText(`${event.name || 'Мероприятие'} ${event.link}`);
            });
        } else {
            addText('-----');
        }
        addEmptyLine();
    });

    addText(`Мероприятия с постом:(Название,Фракция/Фракция)`);
    cities.forEach(city => {
        addText(`${city.name || 'Город'}:`);
        if (city.parsedData.interfactionEvents.length > 0) {
            city.parsedData.interfactionEvents.forEach(event => {
                addText(event.link);
            });
        } else {
            addText('-----');
        }
        addEmptyLine();
    });

    // 16) Мероприятия с ГРП
    addSectionHeader(`16) Список проведенных RP ситуаций, мероприятий при непосредственном участии администрации. (ГРП)`);
    addText(grpEvents || '....');
    addEmptyLine();

    // 17) Общее положение дел
    addSectionHeader(`17) Общее положение дел во фракции — изменения в работе фракции (при наличии), стабильность её работы, качество состава, трудности, с которыми пришлось столкнуться, планы на предстоящий период до сдачи следующего отчёта.`);
    addText(generalInfo || 'Работа хорошая, стабильная. Изменений нет.');

    // Создание документа
    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs
        }]
    });

    // Генерация имени файла
    const formatDate = (date: string) => date.replace(/\./g, '_');
    const fileName = `Otchet_GS_${organization}_${formatDate(dateFrom || 'xx_xx_xx')}_${formatDate(dateTo || 'xx_xx_xx')}.docx`;

    // Создание и скачивание файла
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
};