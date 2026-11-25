import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";
import { getBookedSeats } from "../../utils/bookingUtils";
import { calcTotal, MAX_SEATS, ROWS, SEATS_PER_ROW, seatId, sortSeats, TOTAL_SEATS } from "../../utils/seatUtils";
import "./SeatPicker.css";

// Окреме місце. React.memo: при виборі одного місця перемальовуються лише змінені місця, а не всі 140.
const Seat = memo(function Seat({ id, row, number, status, onToggle }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div
      className={`seat${status === "selected" ? " selected" : ""}${status === "booked" ? " booked" : ""}`}
      role="button"
      tabIndex={status === "booked" ? -1 : 0}
      aria-label={`Ряд ${row}, місце ${number}`}
      aria-pressed={status === "selected"}
      aria-disabled={status === "booked"}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
    >
      {number}
    </div>
  );
});

const SeatPicker = ({ movieId, hallName, price, maxSeats = MAX_SEATS, canBook = true, onBook }) => {
  // Заброньовані місця читаємо один раз при відкритті схеми (Set — швидка перевірка наявності)
  const bookedSeats = useMemo(() => new Set(getBookedSeats(movieId)), [movieId]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [notice, setNotice] = useState(null);

  // ref дозволяє зробити toggleSeat стабільним, щоб memo(Seat) працювало
  const selectedRef = useRef(selectedSeats);
  useEffect(() => {
    selectedRef.current = selectedSeats;
  }, [selectedSeats]);

  const toggleSeat = useCallback(
    (id) => {
      const current = selectedRef.current;

      if (bookedSeats.has(id)) {
        setNotice("Це місце вже заброньовано!");
        return;
      }
      if (current.includes(id)) {
        setNotice(null);
        setSelectedSeats(current.filter((seat) => seat !== id));
        return;
      }
      if (current.length >= maxSeats) {
        setNotice(`Максимум ${maxSeats} місць за один раз`);
        return;
      }
      setNotice(null);
      setSelectedSeats([...current, id]);
    },
    [bookedSeats, maxSeats]
  );

  const selectedSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);
  const sortedSelected = useMemo(() => sortSeats(selectedSeats), [selectedSeats]);
  const total = calcTotal(selectedSeats, price);

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setNotice("Оберіть хоча б одне місце!");
      return;
    }
    onBook(sortedSelected);
    setSelectedSeats([]);
  };

  const statusOf = (id) => (bookedSeats.has(id) ? "booked" : selectedSet.has(id) ? "selected" : "available");

  return (
    <div className="seat-picker">
      {hallName && <h2 className="hall-title">{hallName}</h2>}
      <div className="screen">ЕКРАН</div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div> <span>Вільне</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div> <span>Вибрано</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div> <span>Заброньовано</span>
        </div>
      </div>

      <div className="hall">
        {Array.from({ length: ROWS }, (_, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <div className="row-number">{rowIndex + 1}</div>
            {Array.from({ length: SEATS_PER_ROW }, (_, seatIndex) => {
              const id = seatId(rowIndex + 1, seatIndex + 1);
              return (
                <Seat
                  key={id}
                  id={id}
                  row={rowIndex + 1}
                  number={seatIndex + 1}
                  status={statusOf(id)}
                  onToggle={toggleSeat}
                />
              );
            })}
          </div>
        ))}
      </div>

      {notice && (
        <Alert variant="warning" dismissible onClose={() => setNotice(null)} className="mt-3 mb-0">
          {notice}
        </Alert>
      )}

      <div className="booking-info">
        <p className="text-muted small mb-2">
          Вільних місць: {TOTAL_SEATS - bookedSeats.size} з {TOTAL_SEATS}
        </p>
        <h5>
          Вибрано: <strong>{selectedSeats.length}</strong> місць
          {selectedSeats.length > 0 && <> — до сплати: <strong>{total} грн</strong></>}
        </h5>
        <p className="selected-list">{sortedSelected.join(" • ")}</p>

        <Button variant="success" size="lg" onClick={handleBooking} disabled={selectedSeats.length === 0 || !canBook}>
          Забронювати квитки
        </Button>
        {!canBook && <p className="text-danger small mt-2 mb-0">Щоб забронювати квитки, увійдіть в акаунт.</p>}
      </div>
    </div>
  );
};

SeatPicker.propTypes = {
  movieId: PropTypes.number.isRequired,
  hallName: PropTypes.string,
  price: PropTypes.number.isRequired,
  maxSeats: PropTypes.number,
  canBook: PropTypes.bool,
  onBook: PropTypes.func.isRequired,
};

export default SeatPicker;
