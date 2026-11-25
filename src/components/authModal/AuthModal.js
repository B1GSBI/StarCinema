import { useState } from "react";
import { Modal, Tabs, Tab, Form, Button, Card } from "react-bootstrap";
import SuccessModal from "../successModal/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import { MIN_PASSWORD_LENGTH } from "../../utils/authUtils";

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = { name: "", email: "", password: "", confirmPassword: "" };

// Вікно входу та реєстрації. Стан відкриття живе в AuthContext, тому відкрити його
// можна з будь-якого місця застосунку (меню, картка фільму, бронювання).
const AuthModal = () => {
  const { authModal, closeAuth, setAuthTab, login, register } = useAuth();
  const [loginData, setLoginData] = useState(EMPTY_LOGIN);
  const [registerData, setRegisterData] = useState(EMPTY_REGISTER);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabSelect = (key) => {
    setAuthTab(key);
    setError("");
  };

  // Спільна обробка відправки форми: блокування кнопки, помилки, повідомлення про успіх
  const submit = async (action, onSuccess) => {
    setError("");
    setSubmitting(true);
    try {
      const result = await action();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onSuccess(result.user);
      closeAuth();
    } catch {
      setError("Не вдалося виконати операцію. Відкрийте сайт через localhost або HTTPS.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    submit(
      () => login(loginData.email, loginData.password),
      (user) => {
        setLoginData(EMPTY_LOGIN);
        setSuccessMessage(`Ласкаво просимо, ${user.name}!`);
      }
    );
  };

  const handleRegister = (event) => {
    event.preventDefault();
    submit(
      () => register(registerData),
      () => {
        setRegisterData(EMPTY_REGISTER);
        setSuccessMessage("Реєстрація успішна! Ви увійшли в акаунт.");
      }
    );
  };

  return (
    <>
      <Modal show={authModal.show} onHide={closeAuth} onExited={() => setError("")} centered>
        <Modal.Header className="border-0 pb-2" closeButton>
          <Modal.Title className="w-100 text-center">StarCinema</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 pb-5">
          <Tabs activeKey={authModal.tab} onSelect={handleTabSelect} className="mb-4" variant="underline">
            <Tab eventKey="login" title="Вхід">
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  {error && <p className="text-danger text-center mb-3">{error}</p>}

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        size="lg"
                        autoComplete="email"
                        value={loginData.email}
                        onChange={handleChange(setLoginData)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Введіть пароль"
                        size="lg"
                        autoComplete="current-password"
                        value={loginData.password}
                        onChange={handleChange(setLoginData)}
                        required
                      />
                    </Form.Group>

                    <Button className="w-100 py-3 fw-bold" size="lg" type="submit" variant="danger" disabled={submitting}>
                      {submitting ? "Зачекайте..." : "Увійти"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="register" title="Реєстрація">
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  {error && <p className="text-danger text-center mb-3">{error}</p>}

                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ім'я та прізвище</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Ваше ім'я"
                        size="lg"
                        autoComplete="name"
                        value={registerData.name}
                        onChange={handleChange(setRegisterData)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        size="lg"
                        autoComplete="email"
                        value={registerData.email}
                        onChange={handleChange(setRegisterData)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder={`Щонайменше ${MIN_PASSWORD_LENGTH} символів`}
                        size="lg"
                        autoComplete="new-password"
                        minLength={MIN_PASSWORD_LENGTH}
                        value={registerData.password}
                        onChange={handleChange(setRegisterData)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Повторіть пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Повторіть пароль"
                        size="lg"
                        autoComplete="new-password"
                        value={registerData.confirmPassword}
                        onChange={handleChange(setRegisterData)}
                        required
                      />
                    </Form.Group>

                    <Button className="w-100 py-3 fw-bold" size="lg" type="submit" variant="danger" disabled={submitting}>
                      {submitting ? "Зачекайте..." : "Зареєструватися"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      <SuccessModal show={Boolean(successMessage)} onHide={() => setSuccessMessage("")} message={successMessage} />
    </>
  );
};

export default AuthModal;
