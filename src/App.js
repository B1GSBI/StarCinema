import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import "./App.css";

import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";
import AuthModal from "./components/authModal/AuthModal";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import HomePage from "./pages/HomePage";

// Ліниве завантаження (code splitting): код сторінки підвантажується лише під час переходу на неї
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const BookingsPage = lazy(() => import("./pages/BookingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageLoader = () => (
  <div className="page-top text-center py-5">
    <Spinner animation="border" role="status" variant="danger" />
  </div>
);

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Menu />

      <main className="flex-grow-1">
        <Container className="mt-4">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute message="Увійдіть в акаунт, щоб переглянути список бажаного">
                      <WatchlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute message="Увійдіть в акаунт, щоб переглянути свої бронювання">
                      <BookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Container>
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}

export default App;
