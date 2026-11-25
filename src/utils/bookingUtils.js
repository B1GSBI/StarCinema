import { readJSON, writeJSON } from "./storage";

// Заброньовані місця спільні для всіх користувачів (імітація серверної бази даних),
// тому зберігаються окремо від акаунтів: ключ bookedSeats_<id фільму>.
const keyFor = (movieId) => `bookedSeats_${movieId}`;

export const getBookedSeats = (movieId) => {
  const seats = readJSON(keyFor(movieId), []);
  return Array.isArray(seats) ? seats : [];
};

export const addBookedSeats = (movieId, seats) => {
  const all = [...new Set([...getBookedSeats(movieId), ...seats])];
  writeJSON(keyFor(movieId), all);
  return all;
};

export const releaseSeats = (movieId, seats) => {
  const left = getBookedSeats(movieId).filter((seat) => !seats.includes(seat));
  writeJSON(keyFor(movieId), left);
  return left;
};
