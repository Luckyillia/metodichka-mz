export const APP_VERSION = '1.2.4';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.4',
    date: '2026-02-09',
    changes: [
      'новый видимый интерфейс для создания приказов',
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
