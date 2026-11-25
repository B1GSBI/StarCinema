import { memo } from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { moviePropType } from "../../utils/propTypes";

// Презентаційний компонент: нічого не знає про сховище чи авторизацію,
// отримує дані та колбеки через пропси. React.memo уникає зайвих перемальовувань.
const MovieCard = ({ movie, liked, onBook, onShowDescription, onToggleFavorite }) => {
  const { id, title, img, rating, price } = movie;

  return (
    <Card className="movie-card">
      <Card.Img variant="top" src={img} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>⭐ Рейтинг: {rating}</Card.Text>
        <Card.Text>💰 Ціна: {price} грн</Card.Text>

        <Button variant="danger" onClick={() => onBook(movie)}>
          Купити квиток
        </Button>

        <Button variant="info" className="mt-2" onClick={() => onShowDescription(movie)}>
          Переглянути опис
        </Button>

        <button
          type="button"
          className="favorite-btn"
          aria-label={liked ? `Прибрати «${title}» зі списку бажаного` : `Додати «${title}» до списку бажаного`}
          aria-pressed={liked}
          onClick={() => onToggleFavorite(id)}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: moviePropType.isRequired,
  liked: PropTypes.bool,
  onBook: PropTypes.func.isRequired,
  onShowDescription: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default memo(MovieCard);
