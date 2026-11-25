import { useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button, Modal } from "react-bootstrap";
import SeatPicker from "../seatPicker/SeatPicker";
import SuccessModal from "../successModal/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import { moviePropType } from "../../utils/propTypes";
import { MAX_SEATS } from "../../utils/seatUtils";

// Модальне вікно бронювання: використовується і на головній сторінці, і в списку бажаного
const BookingModal = ({ movie, show, onHide }) => {
  const { user, addBooking, openAuth } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const handleBook = (seats) => {
    const booking = addBooking({ movie, seats });
    if (!booking) return;
    onHide();
    setSuccessMessage(
      `Ви забронювали місця ${seats.join(", ")} на фільм «${movie.title}». Сума: ${booking.total} грн.`
    );
  };

  const handleLoginClick = () => {
    onHide();
    openAuth("login");
  };

  return (
    <>
      <Modal show={show && Boolean(movie)} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Бронювання квитків — {movie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!user && (
            <Alert variant="warning" className="d-flex justify-content-between align-items-center">
              <span>Для бронювання потрібно увійти в акаунт.</span>
              <Button size="sm" variant="danger" onClick={handleLoginClick}>
                Увійти
              </Button>
            </Alert>
          )}
          {movie && (
            <SeatPicker
              key={movie.id}
              movieId={movie.id}
              hallName={movie.hall}
              price={movie.price}
              maxSeats={MAX_SEATS}
              canBook={Boolean(user)}
              onBook={handleBook}
            />
          )}
        </Modal.Body>
      </Modal>

      <SuccessModal show={Boolean(successMessage)} onHide={() => setSuccessMessage("")} message={successMessage} />
    </>
  );
};

BookingModal.propTypes = {
  movie: moviePropType,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default BookingModal;
