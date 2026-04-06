const FilterType = {
  EVERYTHING: "everything",
  FUTURE: "future",
  PRESENT: "present",
  PAST: "past",
};

const isFuturePoint = (point) => point.dateFrom > new Date();
const isPresentPoint = (point) =>
  point.dateFrom <= new Date() && point.dateTo >= new Date();
const isPastPoint = (point) => point.dateTo < new Date();

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFuturePoint),
  [FilterType.PRESENT]: (points) => points.filter(isPresentPoint),
  [FilterType.PAST]: (points) => points.filter(isPastPoint),
};

const generateFilters = (points) => [
  {
    type: FilterType.EVERYTHING,
    name: "Everything",
    isDisabled: false,
  },
  {
    type: FilterType.FUTURE,
    name: "Future",
    isDisabled: filter[FilterType.FUTURE](points).length === 0,
  },
  {
    type: FilterType.PRESENT,
    name: "Present",
    isDisabled: filter[FilterType.PRESENT](points).length === 0,
  },
  {
    type: FilterType.PAST,
    name: "Past",
    isDisabled: filter[FilterType.PAST](points).length === 0,
  },
];

export { FilterType, filter, generateFilters };
