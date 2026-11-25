// Чиста логіка схеми залу (не залежить від React, тому легко тестується).

export const ROWS = 10;
export const SEATS_PER_ROW = 14;
export const MAX_SEATS = 6;
export const TOTAL_SEATS = ROWS * SEATS_PER_ROW;

// Ідентифікатор місця у форматі «ряд-місце», нумерація з 1: "3-12"
export const seatId = (row, seat) => `${row}-${seat}`;

const parseSeat = (id) => id.split("-").map(Number);

// Природне сортування: "1-2" іде перед "1-10" (звичайне sort() порівнювало б рядки)
export const compareSeats = (a, b) => {
  const [rowA, seatA] = parseSeat(a);
  const [rowB, seatB] = parseSeat(b);
  return rowA - rowB || seatA - seatB;
};

export const sortSeats = (seats) => [...seats].sort(compareSeats);

export const calcTotal = (seats, price) => seats.length * Number(price || 0);
