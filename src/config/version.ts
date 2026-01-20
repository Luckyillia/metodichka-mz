export const APP_VERSION = '1.1.0';

// Changelog
export const CHANGELOG = [
  {
    version: '1.1.0',
    date: '2026-01-20',
    changes: [
      'Добавлен раздел по продвижению',
      'Улучшена стабильность работы с базой данных',
      'Добавлена проверка версии при загрузке приложения'
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
