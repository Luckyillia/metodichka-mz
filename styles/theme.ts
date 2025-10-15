// Цветовая схема в стиле Министерства Обороны
// Можно легко изменить цвета здесь, и они применятся ко всему приложению

export const militaryTheme = {
  // Основные цвета (темно-зеленая военная палитра)
  primary: {
    from: '#1a4d2e', // темно-зеленый
    to: '#0d2818',   // очень темно-зеленый
    solid: '#1a4d2e',
    light: '#2d6a4f',
    dark: '#0d2818',
  },
  
  // Акцентные цвета
  accent: {
    green: '#4ade80',
    olive: '#84a98c',
    gold: '#d4af37',
  },
  
  // Градиенты
  gradients: {
    primary: 'linear-gradient(135deg, #1a4d2e 0%, #0d2818 100%)',
    header: 'linear-gradient(90deg, #0d2818 0%, #1a4d2e 50%, #0d2818 100%)',
    sidebar: 'linear-gradient(180deg, #1a4d2e 0%, #0d2818 100%)',
    card: 'linear-gradient(135deg, rgba(26, 77, 46, 0.3) 0%, rgba(13, 40, 24, 0.3) 100%)',
  },
  
  // Фоны
  backgrounds: {
    primary: '#0a1612',
    secondary: '#0d2818',
    card: 'rgba(26, 77, 46, 0.2)',
    hover: 'rgba(45, 106, 79, 0.3)',
    active: 'rgba(26, 77, 46, 0.5)',
  },
  
  // Границы
  borders: {
    primary: 'rgba(45, 106, 79, 0.5)',
    light: 'rgba(132, 169, 140, 0.3)',
    dark: 'rgba(13, 40, 24, 0.8)',
  },
  
  // Текст
  text: {
    primary: '#e8f5e9',
    secondary: '#c8e6c9',
    muted: '#a5d6a7',
    accent: '#4ade80',
  },
  
  // Тени
  shadows: {
    sm: '0 2px 4px rgba(13, 40, 24, 0.3)',
    md: '0 4px 8px rgba(13, 40, 24, 0.4)',
    lg: '0 8px 16px rgba(13, 40, 24, 0.5)',
    xl: '0 12px 24px rgba(13, 40, 24, 0.6)',
  },
  
  // Состояния
  states: {
    success: '#4ade80',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
}

// CSS классы для использования в Tailwind
export const militaryClasses = {
  // Header
  header: 'bg-gradient-to-r from-[#0d2818] via-[#1a4d2e] to-[#0d2818] backdrop-blur-sm border-b border-[#2d6a4f]/50',
  
  // Sidebar
  sidebar: 'bg-gradient-to-b from-[#1a4d2e]/30 to-[#0d2818]/30 backdrop-blur-md rounded-lg border border-[#2d6a4f]/50',
  sidebarItem: 'hover:bg-[#2d6a4f]/30',
  sidebarItemActive: 'bg-[#1a4d2e]/80 shadow-lg shadow-[#0d2818]/50',
  
  // Main content
  content: 'bg-gradient-to-br from-[#1a4d2e]/20 to-[#0d2818]/20 backdrop-blur-sm rounded-lg border border-[#2d6a4f]/50',
  
  // Cards
  card: 'bg-[#1a4d2e]/20 backdrop-blur-sm border border-[#2d6a4f]/50',
  cardHover: 'hover:bg-[#2d6a4f]/30 hover:border-[#4ade80]/30',
  
  // Buttons
  button: 'bg-[#1a4d2e] hover:bg-[#2d6a4f] border border-[#4ade80]/30',
  buttonPrimary: 'bg-[#2d6a4f] hover:bg-[#4ade80] text-white',
  
  // Text
  textPrimary: 'text-[#e8f5e9]',
  textSecondary: 'text-[#c8e6c9]',
  textMuted: 'text-[#a5d6a7]',
  textAccent: 'text-[#4ade80]',
  
  // Titles
  title: 'text-[#4ade80] border-b-2 border-[#4ade80]/50',
}
