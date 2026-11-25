import { useCallback, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import BookingModal from "../components/bookingModal/BookingModal";
import { useAuth } from "../context/AuthContext";
import { useMoviesContext } from "../context/MoviesContext";

const WatchlistPage = () => {
  const { movies, loading, error } = useMoviesContext();
  const { user, toggleFavorite } = useAuth();
  const [booking, setBooking] = useState({ movie: null, show: false });

  // Фільми зі списку бажаного (ідентифікатори, яких немає в афіші, відкидаємо)
  const favoriteMovies = useMemo(
    () =>
      (user?.favoriteMovies ?? [])
        .map((id) => movies.find((movie) => movie.id === id))
        .filter(Boolean),
    [user, movies]
  );

  const handleBook = useCallback((movie) => setBooking({ movie, show: true }), []);

  if (loading) {
    return (
      <Container className="page-top text-center py-5">
        <Spinner animation="border" role="status" variant="danger" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="page-top">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="page-top">
      <h2 className="text-center mb-4">Мій список бажаного</h2>

      {favoriteMovies.length === 0 && (
        <p className="text-center text-muted fs-5 py-5">
          Список бажаного порожній. Додайте фільми на головній сторінці ❤️
        </p>
      )}

      {favoriteMovies.map((movie) => (
        <Card key={movie.id} className="mb-3 shadow-sm">
          <Card.Body className="p-3">
            <Row className="align-items-center">
              <Col xs={12} sm="auto" className="text-center mb-3 mb-sm-0">
                <img
                  src={movie.img}
                  alt={movie.title}
                  style={{ width: "85px", height: "120px", borderRadius: "8px", objectFit: "cover" }}
                />
              </Col>

              <Col xs={12} sm className="text-center text-sm-start">
                <h5 className="mb-2">{movie.title}</h5>

                <div className="d-flex justify-content-center justify-content-sm-start align-items-center gap-2 mb-2">
                  <span className="fs-5">⭐</span>
                  <strong className="fs-5 text-warning">{movie.rating}</strong>
                  <span className="text-muted">/ 10</span>
                </div>

                <p className="text-muted mb-0 small">
                  Ціна квитка: <strong>{movie.price} грн</strong>
                </p>
              </Col>

              <Col xs={12} sm="auto" className="mt-3 mt-sm-0 text-center d-flex flex-column gap-2">
                <Button variant="success" className="w-100" onClick={() => handleBook(movie)}>
                  Перейти до бронювання
                </Button>
                <Button variant="outline-danger" className="w-100" onClick={() => toggleFavorite(movie.id)}>
                  Видалити
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <BookingModal
        movie={booking.movie}
        show={booking.show}
        onHide={() => setBooking((prev) => ({ ...prev, show: false }))}
      />
    </Container>
  );
};

export default WatchlistPage;
