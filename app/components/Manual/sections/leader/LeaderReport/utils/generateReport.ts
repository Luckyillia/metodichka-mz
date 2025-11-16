import { ReportData } from '../types';

export const generateReport = (data: ReportData): string => {
  let report = `Отчет от лидера ${data.faction || 'Фракция'} ${data.nickname || 'Nick_Name'} в период с ${data.dateFrom || 'xx.xx.2025'} по ${data.dateTo || 'xx.xx.2025'}\n\n`;

  // 2. Собеседования
  report += `2) Количество и доказательства проведенных собеседований на сервере.\n`;
  const hasInterviews = data.interviews.some(item => item.link);
  if (hasInterviews) {
    let counter = 1;
    data.interviews.forEach((item) => {
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
  report += `Кол-во уволенных ПСЖ - ${data.firedPSJ || 'xx'}\n`;
  report += `Кол-во уволенных с ОЧС - ${data.firedOCS || 'xx'}\n`;
  report += `Общее кол-во уволенных - ${data.totalFired || 'xx'}\n`;
  report += `Кол-во принятых - ${data.totalHired || 'xx'}\n\n`;

  // 4. Количество сотрудников
  report += `4) Количество сотрудников во фракции на момент сдачи отчета - первые ранги, младший состав, средний состав, старший состав, общее количество.\n`;
  report += `Первые ранги - ${data.firstRanks || 'xx'}\n`;
  report += `Средний состав - ${data.middleStaff || 'xx'}\n`;
  report += `Старший состав - ${data.seniorStaff || 'xx'}\n`;
  report += `Руководящий состав - ${data.managementStaff || 'xx'},с учетом лидера\n`;
  report += `Общее количество сотрудников - ${data.totalStaff || 'xx'}\n\n`;

  // 5. Обзвоны
  report += `5) Количество проведенных обзвонов и принятых сотрудников в старший состав.\n`;
  report += `Количество обзвонов за неделю - ${data.callsPerWeek || 'xx'}\n`;
  report += `Количество принятых - ${data.callsAccepted || 'xx'}\n\n`;

  // 6. Кадровые перестановки
  report += `6) Список кадровых перестановок в старшем составе - никнеймы, отделы, повышения, понижения.\n`;
  report += `${data.staffChanges || '-'}\n\n`;

  // 7. Выговоры
  report += `7) Список выданных выговоров - никнеймы, причины, количество.\n`;
  const hasWarnings = data.warnings.some(item => item.nickname || item.reason);
  if (hasWarnings) {
    data.warnings.forEach((item) => {
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
  report += `Получено - ${data.fundReceived || 'xx'}\n`;
  report += `Выплачено - ${data.fundPaid || 'xx'}\n`;
  report += `Остаток - ${data.fundBalance || 'xx'}\n\n`;

  // 9. Лекции/тренировки/мероприятия
  report += `9) Список проведенных во фракции лекций, тренировок, RP мероприятий и т.п.\n`;
  
  report += `Лекции:\n`;
  const hasLectures = data.lectures.some(item => item.name || item.link);
  if (hasLectures) {
    let counter = 1;
    data.lectures.forEach((item) => {
      if (item.name || item.link) {
        report += `${counter}. ${item.name || 'Название'} - ${item.link || 'Ссылка'}\n`;
        counter++;
      }
    });
  } else {
    report += `-\n`;
  }
  report += `\n`;

  report += `Тренировки:\n`;
  const hasTrainings = data.trainings.some(item => item.name || item.link);
  if (hasTrainings) {
    let counter = 1;
    data.trainings.forEach((item) => {
      if (item.name || item.link) {
        report += `${counter}. ${item.name || 'Название'} - ${item.link || 'Ссылка'}\n`;
        counter++;
      }
    });
  } else {
    report += `-\n`;
  }
  report += `\n`;

  report += `Мероприятия:\n`;
  const hasEvents = data.events.some(item => item.name || item.link);
  if (hasEvents) {
    let counter = 1;
    data.events.forEach((item) => {
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
  const hasBranchEvents = data.branchEvents.some(item => item.name || item.link);
  if (hasBranchEvents) {
    let counter = 1;
    data.branchEvents.forEach((item) => {
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
  const hasInterfactionEvents = data.interfactionEvents.some(item => item.name || item.link);
  if (hasInterfactionEvents) {
    let counter = 1;
    data.interfactionEvents.forEach((item) => {
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
  const hasEvaluations = data.staffEvaluations.some(item => item.nickname || item.rating || item.comment);
  if (hasEvaluations) {
    data.staffEvaluations.forEach((item) => {
      if (item.nickname || item.rating || item.comment) {
        report += `${item.nickname || 'Nick_Name'} - ${item.rating || '0/10'} ${item.comment || 'комментарий'}.\n`;
      }
    });
  } else {
    report += `-\n`;
  }
  report += `\n`;

  // 13. Построения
  report += `13) Проведение двух построений состава.\n`;
  const hasFormations = data.formations.some(item => item.link);
  if (hasFormations) {
    let counter = 1;
    data.formations.forEach((item) => {
      if (item.link) {
        report += `${counter}. ${item.link}\n`;
        counter++;
      }
    });
  } else {
    report += `-\n`;
  }

  return report;
};