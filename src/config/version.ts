export const APP_VERSION = '1.0.7';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.7',
    date: '2025-12-13',
    changes: [
      'Добавлена проверка на деактивированый аккаунт'
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
