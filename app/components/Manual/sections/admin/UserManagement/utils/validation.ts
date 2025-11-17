export const validateGameNick = (nick: string): string | null => {
    const gameNickRegex = /^[A-Za-z]+_[A-Za-z]+$/
  
    if (!nick.trim()) {
      return "Игровой ник обязателен"
    }
  
    if (!gameNickRegex.test(nick)) {
      return "Используйте формат: Имя_Фамилия (только английские буквы)"
    }
  
    if (nick.length < 5 || nick.length > 50) {
      return "Ник должен быть от 5 до 50 символов"
    }
  
    return null
  }
  
  export const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return "Имя пользователя обязательно"
    }
  
    if (username.length < 3 || username.length > 50) {
      return "Имя пользователя должно быть от 3 до 50 символов"
    }
  
    return null
  }
  
  export const validatePassword = (password: string, isRequired: boolean = true): string | null => {
    if (isRequired && !password.trim()) {
      return "Пароль обязателен"
    }
  
    if (password.trim() && password.length < 6) {
      return "Пароль должен содержать минимум 6 символов"
    }
  
    return null
  }