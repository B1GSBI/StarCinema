import { calcTotal, compareSeats, seatId, sortSeats, TOTAL_SEATS } from "./seatUtils";

test("seatId формує ідентифікатор «ряд-місце»", () => {
  expect(seatId(3, 12)).toBe("3-12");
});

test("sortSeats сортує місця природним порядком, а не як рядки", () => {
  expect(sortSeats(["1-10", "1-2", "2-1", "1-1"])).toEqual(["1-1", "1-2", "1-10", "2-1"]);
});

test("sortSeats не змінює вихідний масив", () => {
  const seats = ["2-1", "1-1"];
  sortSeats(seats);
  expect(seats).toEqual(["2-1", "1-1"]);
});

test("compareSeats спочатку порівнює ряди, потім місця", () => {
  expect(compareSeats("1-14", "2-1")).toBeLessThan(0);
  expect(compareSeats("3-5", "3-4")).toBeGreaterThan(0);
});

test("calcTotal рахує вартість як кількість місць × ціна квитка", () => {
  expect(calcTotal(["1-1", "1-2", "1-3"], 220)).toBe(660);
  expect(calcTotal([], 220)).toBe(0);
});

test("у залі 140 місць", () => {
  expect(TOTAL_SEATS).toBe(140);
});
