import PropTypes from "prop-types";
import { Button, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

// Захищений маршрут: сторінка доступна лише авторизованому користувачеві.
// Гостю показуємо запрошення увійти — після входу сторінка з'явиться без перезавантаження.
const ProtectedRoute = ({ children, message = "Увійдіть в акаунт, щоб переглянути цю сторінку" }) => {
  const { isAuthenticated, openAuth } = useAuth();

  if (!isAuthenticated) {
    return (
      <Container className="page-top text-center py-5">
        <h3 className="mb-4">{message}</h3>
        <Button variant="danger" size="lg" onClick={() => openAuth("login")}>
          Увійти
        </Button>
      </Container>
    );
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
};

export default ProtectedRoute;
