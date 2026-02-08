export const APP_VERSION = '1.2.3';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.3',
    date: '2026-02-08',
    changes: [
      'Добавлена возможность выбора модели для валидации биографии',
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
