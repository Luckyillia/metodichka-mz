export const APP_VERSION = '1.0.4';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.4',
    date: '2025-11-09',
    changes: [
      'Улучшен парсинг отчетов Лидера',
      'Так же улучшена визуализация сескции генерации отчетов Администратора'
    ]
  }
];

export const getVersionInfo = () => {
  const currentVersion = CHANGELOG.find(item => item.version === APP_VERSION);
  
  return {
    version: APP_VERSION,
    lastUpdated: currentVersion?.date || new Date().toISOString().split('T')[0],
    changes: currentVersion?.changes || []
  };
};
