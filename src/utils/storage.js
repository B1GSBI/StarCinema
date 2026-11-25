// Безпечні обгортки над localStorage.
// Помилки (переповнення сховища, режим приватного перегляду, пошкоджений JSON)
// не повинні ламати застосунок, тому повертаємо значення за замовчуванням.

export const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ігноруємо: сховище недоступне */
  }
};
