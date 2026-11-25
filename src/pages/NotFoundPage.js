import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const NotFoundPage = () => (
  <Container className="page-top text-center py-5">
    <h1 className="display-1">404</h1>
    <p className="fs-4 text-muted">Таку сторінку не знайдено.</p>
    <Link to="/" className="btn btn-danger btn-lg">
      На головну
    </Link>
  </Container>
);

export default NotFoundPage;
