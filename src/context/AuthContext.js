import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  authenticate,
  clearSession,
  ensureSeedUsers,
  getSessionEmail,
  getUserRecord,
  MIN_PASSWORD_LENGTH,
  registerUser,
  saveUserRecord,
  setSession,
  toPublicUser,
} from "../utils/authUtils";
import { addBookedSeats, releaseSeats } from "../utils/bookingUtils";
import { calcTotal } from "../utils/seatUtils";

const AuthContext = createContext(null);

const loadInitialUser = () => {
  ensureSeedUsers();
  const email = getSessionEmail();
  return email ? toPublicUser(getUserRecord(email)) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadInitialUser);
  const [authModal, setAuthModal] = useState({ show: false, tab: "login" });

  // Актуальний користувач для стабільних колбеків (щоб не перестворювати їх при кожній зміні user)
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const openAuth = useCallback((tab = "login") => setAuthModal({ show: true, tab }), []);
  const closeAuth = useCallback(() => setAuthModal((prev) => ({ ...prev, show: false })), []);
  const setAuthTab = useCallback((tab) => setAuthModal((prev) => ({ ...prev, tab })), []);

  const startSession = useCallback((record) => {
    setSession(record.email);
    setUser(toPublicUser(record));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const record = await authenticate(email, password);
      if (!record) return { ok: false, error: "Невірний email або пароль" };
      startSession(record);
      return { ok: true, user: toPublicUser(record) };
    },
    [startSession]
  );

  const register = useCallback(
    async ({ name, email, password, confirmPassword }) => {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return { ok: false, error: `Пароль має містити щонайменше ${MIN_PASSWORD_LENGTH} символів` };
      }
      if (password !== confirmPassword) {
        return { ok: false, error: "Паролі не співпадають" };
      }
      const { record, error } = await registerUser({ name, email, password });
      if (error) return { ok: false, error };
      startSession(record);
      return { ok: true, user: toPublicUser(record) };
    },
    [startSession]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Зберігає змінений запис поточного користувача й оновлює стан інтерфейсу
  const commit = useCallback((record) => {
    saveUserRecord(record);
    setUser(toPublicUser(record));
  }, []);

  // Додає фільм у список бажаного або прибирає його. Гостю пропонує увійти.
  const toggleFavorite = useCallback(
    (movieId) => {
      const current = userRef.current;
      if (!current) {
        openAuth("login");
        return false;
      }
      const record = getUserRecord(current.email);
      const favorites = record.favoriteMovies || [];
      const next = favorites.includes(movieId)
        ? favorites.filter((id) => id !== movieId)
        : [...favorites, movieId];
      commit({ ...record, favoriteMovies: next });
      return true;
    },
    [commit, openAuth]
  );

  // Зберігає бронювання в історії користувача та позначає місця зайнятими
  const addBooking = useCallback(
    ({ movie, seats }) => {
      const current = userRef.current;
      if (!current) return null;
      const record = getUserRecord(current.email);
      const booking = {
        id: String(Date.now()),
        movieId: movie.id,
        title: movie.title,
        hall: movie.hall,
        seats,
        total: calcTotal(seats, movie.price),
        createdAt: new Date().toISOString(),
      };
      addBookedSeats(movie.id, seats);
      commit({ ...record, bookings: [booking, ...(record.bookings || [])] });
      return booking;
    },
    [commit]
  );

  // Скасовує бронювання й звільняє місця
  const cancelBooking = useCallback(
    (bookingId) => {
      const current = userRef.current;
      if (!current) return;
      const record = getUserRecord(current.email);
      const bookings = record.bookings || [];
      const booking = bookings.find((item) => item.id === bookingId);
      if (!booking) return;
      releaseSeats(booking.movieId, booking.seats);
      commit({ ...record, bookings: bookings.filter((item) => item.id !== bookingId) });
    },
    [commit]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authModal,
      openAuth,
      closeAuth,
      setAuthTab,
      login,
      register,
      logout,
      toggleFavorite,
      addBooking,
      cancelBooking,
    }),
    [user, authModal, openAuth, closeAuth, setAuthTab, login, register, logout, toggleFavorite, addBooking, cancelBooking]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth потрібно викликати всередині AuthProvider");
  }
  return context;
};
