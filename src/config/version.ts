export const APP_VERSION = '1.2.6';

// Changelog
export const CHANGELOG = [
  {
    version: '1.2.6',
    date: '2026-03-11',
    changes: [
      'Добавлено оптимизацию на телефоны',
      'Сделано новый вишки такие как избраные история',
      'Добавлено то когда пользователь заходил в приложение'
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
