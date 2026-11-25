import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Головна", end: true },
  { to: "/about", label: "Про кінотеатр" },
  { to: "/watchlist", label: "Список бажаного" },
  { to: "/bookings", label: "Мої бронювання" },
  { to: "/contacts", label: "Контакти" },
];

const Menu = () => {
  const { user, openAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" collapseOnSelect>
      <Container>
        <Navbar.Brand as={Link} to="/">
          StarCinema
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <Nav.Link key={to} as={NavLink} to={to} end={end} eventKey={to}>
                {label}
              </Nav.Link>
            ))}
          </Nav>

          <Nav>
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-light">
                  Привіт, <strong>{user.name.split(" ")[0]}</strong>
                </span>
                <Button onClick={handleLogout} size="sm" variant="outline-danger">
                  Вийти
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button onClick={() => openAuth("login")} size="sm" variant="outline-light">
                  Увійти
                </Button>
                <Button onClick={() => openAuth("register")} size="sm" variant="danger">
                  Зареєструватися
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
