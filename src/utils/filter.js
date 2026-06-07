export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const isFuturePoint = (point) => point.dateFrom > new Date();
const isPresentPoint = (point) =>
  point.dateFrom <= new Date() && point.dateTo >= new Date();
const isPastPoint = (point) => point.dateTo < new Date();

export const filter = {
  [FilterType.EVERYTHING]: (points) => Array.isArray(points) ? [...points] : [],
  [FilterType.FUTURE]: (points) => points.filter(isFuturePoint),
  [FilterType.PRESENT]: (points) => points.filter(isPresentPoint),
  [FilterType.PAST]: (points) => points.filter(isPastPoint),
};
