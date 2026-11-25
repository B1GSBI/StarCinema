import { useCallback, useEffect, useState } from "react";
import { posterUrl } from "../utils/movieUtils";

// «Серверні» дані афіші описані у файлі public/data/movies.json
// і завантажуються через Fetch API так само, як це робилося б із REST API.
const MOVIES_URL = `${process.env.PUBLIC_URL || ""}/data/movies.json`;

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(MOVIES_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити афішу (код ${response.status})`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Некоректний формат даних афіші");
        }
        setMovies(data.map((movie) => ({ ...movie, img: posterUrl(movie.img) })));
      } catch (e) {
        // AbortError виникає при розмонтуванні — це не помилка для користувача
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort(); // скасовуємо запит при розмонтуванні
  }, [attempt]);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setAttempt((value) => value + 1);
  }, []);

  return { movies, loading, error, reload };
};
