export const APP_VERSION = '1.0.9';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.9',
    date: '2025-12-14',
    changes: [
      'Добавлена возможность сортировки пользователей',
      'Добавлена возможность фильтрации пользователей по городу',
      'Добавлена возможность фильтрации пользователей по роли'
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
