import { sortMoviesByDate } from "./movieUtils";

const movies = [
  { id: 1, date: "2026-03-20" },
  { id: 2, date: "2026-05-01" },
  { id: 3, date: "2026-01-05" },
];

test("за новизною: спочатку найновіші фільми", () => {
  expect(sortMoviesByDate(movies, "new").map((m) => m.id)).toEqual([2, 1, 3]);
});

test("за старизною: спочатку найстаріші фільми", () => {
  expect(sortMoviesByDate(movies, "old").map((m) => m.id)).toEqual([3, 1, 2]);
});

test("сортування не змінює вихідний масив", () => {
  sortMoviesByDate(movies, "new");
  expect(movies.map((m) => m.id)).toEqual([1, 2, 3]);
});
