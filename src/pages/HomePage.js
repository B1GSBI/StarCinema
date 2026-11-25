import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import MovieCard from "../components/movieCard/MovieCard";
import BookingModal from "../components/bookingModal/BookingModal";
import { useAuth } from "../context/AuthContext";
import { useMoviesContext } from "../context/MoviesContext";
import { sortMoviesByDate } from "../utils/movieUtils";

const VISIBLE_CARDS = 4;
const NO_FAVORITES = [];

const HomePage = () => {
  const { movies, loading, error, reload } = useMoviesContext();
  const { user, toggleFavorite } = useAuth();

  const [sortOrder, setSortOrder] = useState("new");
  const [startIndex, setStartIndex] = useState(0);
  // Фільм зберігаємо окремо від прапорця show, щоб вікно не «порожніло» під час анімації закриття
  const [description, setDescription] = useState({ movie: null, show: false });
  const [booking, setBooking] = useState({ movie: null, show: false });

  // useMemo: сортування виконується лише при зміні списку або порядку
  const sortedMovies = useMemo(() => sortMoviesByDate(movies, sortOrder), [movies, sortOrder]);
  const maxStart = Math.max(sortedMovies.length - VISIBLE_CARDS, 0);
  const start = Math.min(startIndex, maxStart);
  const visibleMovies = sortedMovies.slice(start, start + VISIBLE_CARDS);
  const favorites = user?.favoriteMovies ?? NO_FAVORITES;

  // Стабільні колбеки, щоб React.memo у MovieCard справді працював
  const handleBook = useCallback((movie) => setBooking({ movie, show: true }), []);
  const handleShowDescription = useCallback((movie) => setDescription({ movie, show: true }), []);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setStartIndex(0);
  };

  if (loading) {
    return (
      <div className="page-top text-center py-5">
        <Spinner animation="border" role="status" variant="danger" />
        <p className="mt-3 text-muted">Завантаження афіші...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-top">
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <Button variant="outline-danger" size="sm" onClick={reload}>
            Спробувати ще раз
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="page-top">
      <Alert variant="success" className="mb-3">
        {user ? `Вітаємо, ${user.name}! Оберіть фільм і забронюйте місця.` : "Вітаємо у системі бронювання кіно!"}
      </Alert>

      <div className="d-flex justify-content-end align-items-center mb-3">
        <label htmlFor="sort-order" className="me-2 fw-bold">
          Відсортувати за:
        </label>
        <select id="sort-order" className="form-select w-auto" value={sortOrder} onChange={handleSortChange}>
          <option value="new">Новизною</option>
          <option value="old">Старизною</option>
        </select>
      </div>

      <div className="carousel-wrapper">
        <button
          type="button"
          className="arrow-btn left"
          aria-label="Попередні фільми"
          disabled={start === 0}
          onClick={() => setStartIndex(Math.max(start - 1, 0))}
        >
          ❮
        </button>

        <Row className="justify-content-center g-4">
          {visibleMovies.map((movie) => (
            <Col md="auto" key={movie.id} className="mb-4">
              <MovieCard
                movie={movie}
                liked={favorites.includes(movie.id)}
                onBook={handleBook}
                onShowDescription={handleShowDescription}
                onToggleFavorite={toggleFavorite}
              />
            </Col>
          ))}
        </Row>

        <button
          type="button"
          className="arrow-btn right"
          aria-label="Наступні фільми"
          disabled={start >= maxStart}
          onClick={() => setStartIndex(Math.min(start + 1, maxStart))}
        >
          ❯
        </button>
      </div>

      <Modal show={description.show} onHide={() => setDescription((prev) => ({ ...prev, show: false }))} centered>
        <Modal.Header closeButton>
          <Modal.Title>{description.movie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{description.movie?.description}</p>
          <strong>Рейтинг:</strong> {description.movie?.rating}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDescription((prev) => ({ ...prev, show: false }))}>
            Закрити
          </Button>
        </Modal.Footer>
      </Modal>

      <BookingModal
        movie={booking.movie}
        show={booking.show}
        onHide={() => setBooking((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default HomePage;
