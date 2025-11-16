import React, { useState, useEffect } from 'react';

interface SSReportParserProps {
  onParse: (data: ParsedSSData) => void;
}

export interface ParsedSSData {
  interviews: Array<{ link: string }>;
  lectures: Array<{ name: string; link: string }>;
  trainings: Array<{ name: string; link: string }>;
  events: Array<{ name: string; link: string }>;
}

interface SSReportItem {
  id: number;
  text: string;
  isParsed: boolean;
}

export const SSReportParser: React.FC<SSReportParserProps> = ({ onParse }) => {
  const [reports, setReports] = useState<SSReportItem[]>([
    { id: 1, text: '', isParsed: false }
  ]);

  const parseSSReport = (reportText: string): ParsedSSData => {
    const interviews: Array<{ link: string }> = [];
    const lectures: Array<{ name: string; link: string }> = [];
    const trainings: Array<{ name: string; link: string }> = [];
    const events: Array<{ name: string; link: string }> = [];

    const lines = reportText.split('\n');
    let currentSection = '';

    console.log('Начинаем парсинг отчета...');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Определяем текущую секцию - ищем "Проведение"
      if (line.match(/^\d+\.\s*Проведение\s+.*собеседовани/i)) {
        currentSection = 'interviews';
        console.log('Найдена секция: собеседования');
        continue;
      } else if (line.match(/^\d+\.\s*Проведение\s+.*лекци/i)) {
        currentSection = 'lectures';
        console.log('Найдена секция: лекции');
        continue;
      } else if (line.match(/^\d+\.\s*Проведение\s+.*тренировок/i)) {
        currentSection = 'trainings';
        console.log('Найдена секция: тренировки');
        continue;
      } else if (line.match(/^\d+\.\s*Проведение\s+мероприяти/i)) {
        currentSection = 'events';
        console.log('Найдена секция: мероприятия');
        continue;
      } else if (line.match(/^\d+\.\s+[А-Яа-яA-Za-z]/)) {
        // Новая секция, сбрасываем текущую
        if (!line.match(/^\d+\.\d+/)) {
          currentSection = '';
        }
      }

      // Парсим содержимое секций - ищем подпункты типа 1.1, 2.1 и т.д.
      if (line.match(/^\d+\.\d+/) && currentSection) {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        const url = urlMatch ? urlMatch[1] : '';

        console.log(`Обработка строки в секции ${currentSection}:`, line);

        if (currentSection === 'interviews') {
          if (url) {
            interviews.push({ link: url });
            console.log('Добавлено собеседование:', url);
          }
        } else if (currentSection === 'lectures') {
          // Ищем название лекции
          let name = '';
          const nameMatch = line.match(/Лекция\s*["«]([^"»]+)["»]/i);
          if (nameMatch) {
            name = nameMatch[1];
          } else {
            // Пробуем извлечь из формата "2.1 Название лекции - ссылка" или "2.1 Название: ссылка"
            const colonOrDashMatch = line.match(/^\d+\.\d+\s+(.+?)(?:\s*[-:]\s*https?:)/);
            if (colonOrDashMatch) {
              name = colonOrDashMatch[1].replace(/^Лекция\s*/i, '').trim();
            }
          }
          
          if (url || name) {
            lectures.push({ name: name || 'Лекция', link: url });
            console.log('Добавлена лекция:', name, url);
          }
        } else if (currentSection === 'trainings') {
          // Ищем название тренировки
          let name = '';
          const nameMatch = line.match(/Тренировка\s*["«]([^"»]+)["»]/i);
          if (nameMatch) {
            name = nameMatch[1];
          } else {
            const colonOrDashMatch = line.match(/^\d+\.\d+\s+(.+?)(?:\s*[-:]\s*https?:)/);
            if (colonOrDashMatch) {
              name = colonOrDashMatch[1].replace(/^Тренировка\s*/i, '').trim();
            }
          }
          
          if (url || name) {
            trainings.push({ name: name || 'Тренировка', link: url });
            console.log('Добавлена тренировка:', name, url);
          }
        } else if (currentSection === 'events') {
          // Ищем название мероприятия
          let name = '';
          
          // Проверяем межфракционное
          if (line.match(/Меж\.?фрак/i)) {
            name = 'Межфракционное мероприятие';
          } else {
            const nameMatch = line.match(/Мероприятие\s*["«]([^"»]+)["»]/i);
            if (nameMatch) {
              name = nameMatch[1];
            } else {
              const colonOrDashMatch = line.match(/^\d+\.\d+\s+(.+?)(?:\s*[-:]\s*https?:)/);
              if (colonOrDashMatch) {
                name = colonOrDashMatch[1].replace(/^Мероприятие\s*/i, '').trim();
              }
            }
          }
          
          if (url || name) {
            events.push({ name: name || 'Мероприятие', link: url });
            console.log('Добавлено мероприятие:', name, url);
          }
        }
      }
    }

    console.log('Результаты парсинга:', { interviews, lectures, trainings, events });
    return { interviews, lectures, trainings, events };
  };

  const handleAdd = () => {
    const newId = Math.max(...reports.map(r => r.id), 0) + 1;
    setReports([...reports, { id: newId, text: '', isParsed: false }]);
  };

  const handleRemove = (id: number) => {
    if (reports.length === 1) return;
    setReports(reports.filter(r => r.id !== id));
  };

  const handleChange = (id: number, text: string) => {
    const updatedReports = reports.map(r => 
      r.id === id ? { ...r, text, isParsed: false } : r
    );
    setReports(updatedReports);

    // Автоматически парсим если текст не пустой
    if (text.trim()) {
      // Небольшая задержка для улучшения UX при быстром вводе
      setTimeout(() => {
        const currentReport = updatedReports.find(r => r.id === id);
        if (currentReport && currentReport.text === text && !currentReport.isParsed) {
          const parsed = parseSSReport(text);
          const totalItems = 
            parsed.interviews.length + 
            parsed.lectures.length + 
            parsed.trainings.length + 
            parsed.events.length;
          
          if (totalItems > 0) {
            onParse(parsed);
            setReports(prev => prev.map(r => 
              r.id === id ? { ...r, isParsed: true } : r
            ));
          }
        }
      }, 500); // 500мс задержка после последнего изменения
    }
  };

  return (
    <div className="modern-card p-6 bg-blue-500/5 border-blue-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📄</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Импорт отчетов старшего состава</h3>
          <p className="text-sm text-muted-foreground">
            Вставьте отчеты СС — они автоматически обработаются
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => (
          <div key={report.id} className="border border-input rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Отчет СС #{index + 1}
              </span>
              <div className="flex gap-2">
                {report.isParsed && (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-600 rounded-md flex items-center gap-1">
                    <span className="animate-pulse">✓</span> Обработан
                  </span>
                )}
                {report.text && !report.isParsed && (
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-md flex items-center gap-1">
                    <span className="animate-spin">⚙</span> Обработка...
                  </span>
                )}
                <button
                  onClick={() => handleRemove(report.id)}
                  disabled={reports.length === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    reports.length === 1
                      ? 'bg-gray-500/10 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <textarea
              value={report.text}
              onChange={(e) => handleChange(report.id, e.target.value)}
              placeholder="Вставьте сюда текст отчета СС...

После вставки отчет автоматически обработается."
              rows={8}
              className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono text-sm"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="mt-4 w-full px-4 py-2 bg-blue-500/20 text-blue-500 rounded-md hover:bg-blue-500/30 font-medium"
      >
        + Добавить еще один отчет СС
      </button>
      
      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
        <p className="text-xs text-blue-600">
          💡 Совет: Вставьте текст отчета и подождите 0.5 секунды — он автоматически обработается. 
          После обработки данные добавятся в секции ниже.
        </p>
      </div>
    </div>
  );
};