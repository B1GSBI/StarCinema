import { createContext, useContext, useMemo } from "react";
import { useMovies } from "../hooks/useMovies";

const MoviesContext = createContext(null);

// Афіша завантажується один раз і доступна всім сторінкам без передачі пропсів
export const MoviesProvider = ({ children }) => {
  const { movies, loading, error, reload } = useMovies();
  const value = useMemo(
    () => ({ movies, loading, error, reload }),
    [movies, loading, error, reload]
  );
  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
};

export const useMoviesContext = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMoviesContext потрібно викликати всередині MoviesProvider");
  }
  return context;
};
