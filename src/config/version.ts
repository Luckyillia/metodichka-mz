export const APP_VERSION = '1.0.10';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.10',
    date: '2025-12-15',
    changes: [
      'Исправлена ошибка сортировки в разделе экзаменов',
      'Улучшена стабильность работы с localStorage',
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
