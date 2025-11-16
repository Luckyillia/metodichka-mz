"use client"

import React, { useState } from 'react';
import { ReportData } from './types';
import { generateReport } from './utils/generateReport';
import { TextInput } from './components/TextInput';
import { TextAreaInput } from './components/TextAreaInput';
import { SimpleLinkList } from './components/SimpleLinkList';
import { NamedLinkList } from './components/NamedLinkList';
import { WarningList } from './components/WarningList';
import { EvaluationList } from './components/EvaluationList';
import { SectionCard } from './components/SectionCard';

const LeaderReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    faction: '',
    nickname: '',
    dateFrom: '',
    dateTo: '',
    interviews: [{ link: '' }],
    firedPSJ: '',
    firedOCS: '',
    totalFired: '',
    totalHired: '',
    firstRanks: '',
    middleStaff: '',
    seniorStaff: '',
    managementStaff: '',
    totalStaff: '',
    callsPerWeek: '',
    callsAccepted: '',
    staffChanges: '',
    warnings: [{ nickname: '', reason: '' }],
    fundReceived: '',
    fundPaid: '',
    fundBalance: '',
    lectures: [{ name: '', link: '' }],
    trainings: [{ name: '', link: '' }],
    events: [{ name: '', link: '' }],
    branchEvents: [{ name: '', link: '' }],
    interfactionEvents: [{ name: '', link: '' }],
    staffEvaluations: [{ nickname: '', rating: '', comment: '' }],
    formations: [{ link: '' }],
  });

  const updateField = <K extends keyof ReportData>(field: K, value: ReportData[K]) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const copyReport = () => {
    const report = generateReport(reportData);
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

      <SectionCard title="Основная информация">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Фракция" value={reportData.faction} onChange={(v) => updateField('faction', v)} placeholder="Название фракции" />
          <TextInput label="Никнейм" value={reportData.nickname} onChange={(v) => updateField('nickname', v)} placeholder="Nick_Name" />
          <TextInput label="Период с" value={reportData.dateFrom} onChange={(v) => updateField('dateFrom', v)} placeholder="xx.xx.2025" />
          <TextInput label="Период по" value={reportData.dateTo} onChange={(v) => updateField('dateTo', v)} placeholder="xx.xx.2025" />
        </div>
      </SectionCard>

      <SectionCard title="2. Проведенные собеседования">
        <SimpleLinkList 
          items={reportData.interviews} 
          onChange={(v) => updateField('interviews', v)} 
          placeholder="Ссылка на собеседование"
          addButtonText="+ Добавить собеседование"
        />
      </SectionCard>

      <SectionCard title="3. Принятые и уволенные сотрудники">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Уволенных ПСЖ" value={reportData.firedPSJ} onChange={(v) => updateField('firedPSJ', v)} placeholder="xx" />
          <TextInput label="Уволенных с ОЧС" value={reportData.firedOCS} onChange={(v) => updateField('firedOCS', v)} placeholder="xx" />
          <TextInput label="Общее кол-во уволенных" value={reportData.totalFired} onChange={(v) => updateField('totalFired', v)} placeholder="xx" />
          <TextInput label="Кол-во принятых" value={reportData.totalHired} onChange={(v) => updateField('totalHired', v)} placeholder="xx" />
        </div>
      </SectionCard>

      <SectionCard title="4. Количество сотрудников на момент отчета">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Первые ранги" value={reportData.firstRanks} onChange={(v) => updateField('firstRanks', v)} placeholder="xx" />
          <TextInput label="Средний состав" value={reportData.middleStaff} onChange={(v) => updateField('middleStaff', v)} placeholder="xx" />
          <TextInput label="Старший состав" value={reportData.seniorStaff} onChange={(v) => updateField('seniorStaff', v)} placeholder="xx" />
          <TextInput label="Руководящий состав (с учетом лидера)" value={reportData.managementStaff} onChange={(v) => updateField('managementStaff', v)} placeholder="xx" />
          <div className="md:col-span-2">
            <TextInput label="Общее количество сотрудников" value={reportData.totalStaff} onChange={(v) => updateField('totalStaff', v)} placeholder="xx" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="5. Обзвоны и принятые в старший состав">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput label="Количество обзвонов за неделю" value={reportData.callsPerWeek} onChange={(v) => updateField('callsPerWeek', v)} placeholder="xx" />
          <TextInput label="Количество принятых" value={reportData.callsAccepted} onChange={(v) => updateField('callsAccepted', v)} placeholder="xx" />
        </div>
      </SectionCard>

      <SectionCard title="6. Кадровые перестановки в старшем составе">
        <TextAreaInput 
          label="" 
          value={reportData.staffChanges} 
          onChange={(v) => updateField('staffChanges', v)} 
          placeholder="Никнеймы, отделы, повышения, понижения (или '-' если нет)"
        />
      </SectionCard>

      <SectionCard title="7. Выданные выговоры">
        <WarningList items={reportData.warnings} onChange={(v) => updateField('warnings', v)} />
      </SectionCard>

      <SectionCard title="8. Фонд неустоек">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput label="Получено" value={reportData.fundReceived} onChange={(v) => updateField('fundReceived', v)} placeholder="xx" />
          <TextInput label="Выплачено" value={reportData.fundPaid} onChange={(v) => updateField('fundPaid', v)} placeholder="xx" />
          <TextInput label="Остаток" value={reportData.fundBalance} onChange={(v) => updateField('fundBalance', v)} placeholder="xx" />
        </div>
      </SectionCard>

      <SectionCard title="9. Лекции">
        <NamedLinkList 
          items={reportData.lectures} 
          onChange={(v) => updateField('lectures', v)}
          namePlaceholder="Название лекции"
          linkPlaceholder="Ссылка"
          addButtonText="+ Добавить лекцию"
        />
      </SectionCard>

      <SectionCard title="9. Тренировки">
        <NamedLinkList 
          items={reportData.trainings} 
          onChange={(v) => updateField('trainings', v)}
          namePlaceholder="Название тренировки"
          linkPlaceholder="Ссылка"
          addButtonText="+ Добавить тренировку"
        />
      </SectionCard>

      <SectionCard title="9. Мероприятия">
        <NamedLinkList 
          items={reportData.events} 
          onChange={(v) => updateField('events', v)}
          namePlaceholder="Название мероприятия"
          linkPlaceholder="Ссылка"
          addButtonText="+ Добавить мероприятие"
        />
      </SectionCard>

      <SectionCard title="10. Мероприятия от всех филиалов организации">
        <NamedLinkList 
          items={reportData.branchEvents} 
          onChange={(v) => updateField('branchEvents', v)}
          namePlaceholder="Название"
          linkPlaceholder="Ссылка"
          addButtonText="+ Добавить мероприятие"
        />
      </SectionCard>

      <SectionCard title="11. Межфракционные мероприятия (с участием лидера)">
        <NamedLinkList 
          items={reportData.interfactionEvents} 
          onChange={(v) => updateField('interfactionEvents', v)}
          namePlaceholder="Название"
          linkPlaceholder="Ссылка"
          addButtonText="+ Добавить мероприятие"
        />
      </SectionCard>

      <SectionCard title="12. Оценка работы старшего состава">
        <EvaluationList items={reportData.staffEvaluations} onChange={(v) => updateField('staffEvaluations', v)} />
      </SectionCard>

      <SectionCard title="13. Проведение двух построений состава" highlight>
        <p className="text-sm text-muted-foreground mb-4">Добавьте ссылки на проведенные построения</p>
        <SimpleLinkList 
          items={reportData.formations} 
          onChange={(v) => updateField('formations', v)}
          placeholder="Ссылка на построение"
          addButtonText="+ Добавить построение"
        />
      </SectionCard>

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

      <div className="modern-card p-6">
        <h3 className="text-lg font-semibold mb-4">Предпросмотр отчета</h3>
        <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
          {generateReport(reportData)}
        </pre>
      </div>
    </div>
  );
};

export default LeaderReport;