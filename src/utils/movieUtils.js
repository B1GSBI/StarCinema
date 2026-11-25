// Допоміжні функції для роботи з даними про фільми.

// order: "new" — спочатку найновіші, "old" — спочатку найстаріші
export const sortMoviesByDate = (movies, order = "new") => {
  const direction = order === "new" ? -1 : 1;
  return [...movies].sort(
    (a, b) => direction * (new Date(a.date) - new Date(b.date))
  );
};

// Постери лежать у public/images, тому шлях будуємо від PUBLIC_URL
export const posterUrl = (img) => `${process.env.PUBLIC_URL || ""}/${img}`;
