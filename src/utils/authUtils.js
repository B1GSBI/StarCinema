import { readJSON, writeJSON, removeKey } from "./storage";

// Облікові записи зберігаються в localStorage (навчальна імітація серверної БД).
// Пароль у відкритому вигляді не зберігається — тільки SHA-256 хеш.
// У реальному проєкті автентифікація виконується на сервері (JWT / httpOnly cookie).

const USER_PREFIX = "user_";
const SESSION_KEY = "currentUser";
export const MIN_PASSWORD_LENGTH = 6;

export const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

// Хеш рахується від "email:пароль", тому однакові паролі різних користувачів дають різні хеші
export const hashPassword = async (email, password) => {
  const data = new TextEncoder().encode(`${normalizeEmail(email)}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const getUserRecord = (email) => readJSON(USER_PREFIX + normalizeEmail(email), null);
export const saveUserRecord = (record) => writeJSON(USER_PREFIX + normalizeEmail(record.email), record);

// Дані, безпечні для передачі в інтерфейс (без хеша пароля)
export const toPublicUser = (record) =>
  record
    ? {
        email: record.email,
        name: record.name,
        role: record.role || "user",
        favoriteMovies: record.favoriteMovies || [],
        bookings: record.bookings || [],
      }
    : null;

// ----- сесія -----
export const getSessionEmail = () => {
  const value = readJSON(SESSION_KEY, null);
  if (typeof value === "string") return value;
  return value && value.email ? value.email : null; // сумісність зі старим форматом
};
export const setSession = (email) => writeJSON(SESSION_KEY, normalizeEmail(email));
export const clearSession = () => removeKey(SESSION_KEY);

// ----- демонстраційні користувачі (пароль для обох: user123) -----
const SEED_USERS = [
  {
    email: "user1@gmail.com",
    name: "Oleh",
    role: "user",
    favoriteMovies: [1, 4],
    bookings: [],
    passwordHash: "21fded9c68a1b272a08c40438802990b10fbdb3a547e2144fd51ebd23202e0b2",
  },
  {
    email: "user2@gmail.com",
    name: "Petro",
    role: "user",
    favoriteMovies: [2, 5],
    bookings: [],
    passwordHash: "433fdf45b42593995fa79c1fdfb3d571faee2071619b37f2722e1dd51e051d86",
  },
];

export const ensureSeedUsers = () => {
  SEED_USERS.forEach((user) => {
    if (!getUserRecord(user.email)) saveUserRecord(user);
  });
};

// ----- автентифікація -----
// Повертає запис користувача або null, якщо email/пароль невірні.
export const authenticate = async (email, password) => {
  const record = getUserRecord(email);
  if (!record) return null;

  const hash = await hashPassword(email, password);
  if (record.passwordHash) return record.passwordHash === hash ? record : null;

  // Сумісність зі старою версією, де пароль зберігався у відкритому вигляді:
  // після першого входу переносимо запис на хеш.
  if (record.password !== undefined && record.password === password) {
    const upgraded = { ...record, passwordHash: hash };
    delete upgraded.password;
    saveUserRecord(upgraded);
    return upgraded;
  }
  return null;
};

export const registerUser = async ({ name, email, password }) => {
  if (getUserRecord(email)) {
    return { error: "Користувач із таким email вже існує" };
  }
  const record = {
    email: normalizeEmail(email),
    name: name.trim(),
    role: "user",
    favoriteMovies: [],
    bookings: [],
    passwordHash: await hashPassword(email, password),
  };
  saveUserRecord(record);
  return { record };
};
