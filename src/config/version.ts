export const APP_VERSION = '1.0.3';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.3',
    date: '2025-11-09',
    changes: [
      'Обновлен раздел генерации отчета лидера',
      'Добавлены новые разделы генерации отчета администратора'
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
