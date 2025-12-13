export const APP_VERSION = '1.0.8';

// Changelog
export const CHANGELOG = [
  {
    version: '1.0.8',
    date: '2025-12-13',
    changes: [
      'Улучшена безопасность сайта и страница входа',
      'Добавлена проверка на деактивированый аккаунт',
      'Добавлена проверка на запрос на создание аккаунта'
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
