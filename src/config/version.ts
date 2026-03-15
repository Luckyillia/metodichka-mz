export const APP_VERSION = '1.2.7';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.7',
    date: '2026-03-15',
    changes: [
      'Исправлены баги с отображением приказов'
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
