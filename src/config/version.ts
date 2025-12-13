export const APP_VERSION = '1.0.6';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.6',
    date: '2025-12-13',
    changes: [
      'Добавление функции перемещения пользователя'
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
