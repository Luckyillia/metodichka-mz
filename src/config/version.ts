export const APP_VERSION = '1.2.0';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.0',
    date: '2026-02-08',
    changes: [
      'Добавлен личный кабинет',
      'Добавлена возможность загрузки аватаров'
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
