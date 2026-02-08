'use client';

import { getVersionInfo } from '@/src/config/version';
import { useEffect, useState } from 'react';

// Define a custom event type for theme changes
declare global {
  interface WindowEventMap {
    'theme-changed': CustomEvent<{ theme: string }>;
  }
}

export const AppFooter = () => {
  const { version, lastUpdated } = getVersionInfo();
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    // Get current theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    
    // Function to handle theme changes
    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme') || 'dark';
      setCurrentTheme(theme);
    };
    
    // Listen for both storage and custom theme change events
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    
    // Set up a mutation observer to watch for theme class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const theme = document.documentElement.className;
          setCurrentTheme(theme);
        }
      });
    });
    
    // Start observing the html element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
      observer.disconnect();
    };
  }, []);

  // Define theme-specific styles
  const getThemeStyles = () => {
    switch(currentTheme) {
      case 'theme-mz-glow':
        return 'bg-[#15151a] text-[#e5e5ea] border-t border-red-600/30';
      case 'theme-crimson-gradient':
        return 'bg-gradient-to-r from-[#2d1419] to-[#3d1e24] text-[#ffe5e5] border-t border-red-800/50';
      case 'theme-sunset-gradient':
        return 'bg-gradient-to-r from-[#2d1f14] to-[#3d2a19] text-[#fff5e5] border-t border-orange-700/50';
      case 'theme-midnight-purple':
        return 'bg-gradient-to-r from-[#05050a] to-[#0f0f1a] text-[#f5f3ff] border-t border-purple-900/50';
      case 'theme-aurora':
        return 'bg-gradient-to-r from-[#020617] to-[#0f172a] text-[#f0fdfa] border-t border-teal-900/50';
      default: // dark theme
        return 'bg-[#0f172a] text-[#f1f5f9] border-t border-slate-700';
    }
  };
  
  return (
    <footer className={`py-4 transition-colors duration-300 ${getThemeStyles()}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
              © {new Date().getFullYear()} Методичка МЗ
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-gray-400/30"></span>
            <div className="flex items-center space-x-2 text-sm opacity-80">
              <span>Версия {version}</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Обновлено {lastUpdated}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs opacity-70">
            <span>Разработано с</span>
            <span className="text-red-400">❤</span>
            <span>для МЗ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
