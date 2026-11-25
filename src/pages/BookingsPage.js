import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { sortSeats } from "../utils/seatUtils";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" });

// Особистий кабінет: історія бронювань поточного користувача зі скасуванням
const BookingsPage = () => {
  const { user, cancelBooking } = useAuth();
  const bookings = user?.bookings ?? [];

  return (
    <Container className="page-top">
      <h2 className="text-center mb-4">Мої бронювання</h2>

      {bookings.length === 0 && (
        <p className="text-center text-muted fs-5 py-5">
          У вас ще немає бронювань. Оберіть фільм на головній сторінці.
        </p>
      )}

      {bookings.map((booking) => (
        <Card key={booking.id} className="mb-3 shadow-sm">
          <Card.Body className="p-3">
            <Row className="align-items-center">
              <Col xs={12} md>
                <h5 className="mb-1">{booking.title}</h5>
                <p className="text-muted small mb-2">
                  {booking.hall} · {formatDate(booking.createdAt)}
                </p>
                <p className="mb-0">
                  Місця: <strong>{sortSeats(booking.seats).join(" • ")}</strong>
                </p>
              </Col>

              <Col xs={12} md="auto" className="text-md-end mt-3 mt-md-0">
                <div className="fs-5 mb-2">
                  Сума: <strong>{booking.total} грн</strong>
                </div>
                <Button variant="outline-danger" size="sm" onClick={() => cancelBooking(booking.id)}>
                  Скасувати бронювання
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default BookingsPage;
