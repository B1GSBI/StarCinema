# StarCinema

Сайт бронювання квитків у кінотеатр (React 18 + React Router 6 + React-Bootstrap).
Курсова робота з дисципліни «Технології компонентного програмного забезпечення для веб».

## Запуск

Потрібен [Node.js](https://nodejs.org) (рекомендовано версію 18 або 20).

```bash
npm install
npm start        # http://localhost:3000
npm test         # юніт-тести (Jest)
npm run build    # production-збірка
```

> Сайт потрібно відкривати через `localhost` або HTTPS: хешування паролів використовує
> `crypto.subtle`, який недоступний на звичайному HTTP з іншої адреси.

## Тестові акаунти

| Email           | Пароль  |
| --------------- | ------- |
| user1@gmail.com | user123 |
| user2@gmail.com | user123 |

Також можна зареєструвати власного користувача. Дані зберігаються в `localStorage` браузера
(навчальна імітація серверної бази даних), паролі — лише у вигляді SHA-256 хеша.
Щоб скинути всі дані, виконайте в консолі браузера `localStorage.clear()`.

## Можливості

- афіша фільмів (дані завантажуються через `fetch` з `public/data/movies.json`), сортування, карусель, опис фільму;
- інтерактивна схема залу 10 × 14 місць: вільні / вибрані / заброньовані, ліміт 6 місць, підрахунок суми;
- реєстрація та вхід, список бажаного, історія бронювань зі скасуванням;
- маршрутизація (React Router), захищені сторінки, сторінки «Про кінотеатр» і «Контакти», сторінка 404;
- адаптивний інтерфейс (Bootstrap 5).

## Структура

```
public/
  data/movies.json          ← «серверні» дані афіші
  images/                   ← постери (зараз заглушки; замініть файли, зберігши назви)
src/
  index.js                  ← BrowserRouter + AuthProvider + MoviesProvider
  App.js                    ← розмітка, маршрути, lazy/Suspense, ErrorBoundary
  context/                  ← Context API: AuthContext, MoviesContext
  hooks/useMovies.js        ← власний хук: Fetch API, завантаження / помилка / повторний запит
  pages/                    ← HomePage, AboutPage, ContactsPage, WatchlistPage, BookingsPage, NotFoundPage
  components/               ← menu, movieCard, seatPicker, bookingModal, authModal,
                              successModal, footer, errorBoundary, protectedRoute
  utils/                    ← storage, authUtils, bookingUtils, seatUtils, movieUtils, propTypes (+ *.test.js)
```

## Відповідність темам методичних вказівок

| Тема                                         | Де в проєкті                                                        |
| -------------------------------------------- | ------------------------------------------------------------------- |
| Компоненти, пропси, стан                     | `components/*`, `pages/*`                                           |
| Хуки `useState`, `useEffect`                 | `useMovies`, `SeatPicker`, `AuthContext`                            |
| `useMemo`, `useCallback`, `useRef`           | `HomePage`, `SeatPicker`, `AuthContext`                             |
| Context API                                  | `context/AuthContext.js`, `context/MoviesContext.js`                |
| Власні хуки                                  | `hooks/useMovies.js`, `useAuth`, `useMoviesContext`                 |
| Fetch API, async/await, стани завантаження   | `hooks/useMovies.js` (з `AbortController`)                          |
| Зовнішні бібліотеки                          | React Router, React-Bootstrap, PropTypes                            |
| Патерни: презентаційні / контейнерні, HOC-подібний захист | `MovieCard` (презентаційний), `ProtectedRoute`         |
| Оптимізація                                  | `React.memo`, `useMemo`, `useCallback`, `React.lazy` + `Suspense`   |
| Безпека                                      | хеш паролів, відсутність `dangerouslySetInnerHTML`, валідація форм  |
| Класовий компонент                           | `ErrorBoundary`                                                     |
| Тестування                                   | `src/utils/*.test.js`                                               |
