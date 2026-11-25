import PropTypes from "prop-types";

export const moviePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  img: PropTypes.string,
  rating: PropTypes.number,
  price: PropTypes.number.isRequired,
  date: PropTypes.string,
  hall: PropTypes.string,
  description: PropTypes.string,
});
