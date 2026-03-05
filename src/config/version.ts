export const APP_VERSION = '1.2.5';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.5',
    date: '2026-03-05',
    changes: [
      'Новая система восстановления аккаунта',
      'Исправлены баги в валидаторе биографий',
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
