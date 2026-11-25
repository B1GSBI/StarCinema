import { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";

// Єдиний класовий компонент у проєкті: перехоплення помилок рендерингу
// (getDerivedStateFromError / componentDidCatch) поки що можливе лише в класах.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Помилка інтерфейсу:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="danger" className="mt-5">
          <Alert.Heading>Щось пішло не так</Alert.Heading>
          <p>Під час відображення сторінки сталася помилка.</p>
          <Button variant="outline-danger" onClick={() => this.setState({ hasError: false })}>
            Спробувати ще раз
          </Button>
        </Alert>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
