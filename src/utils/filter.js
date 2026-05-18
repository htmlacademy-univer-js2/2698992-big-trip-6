import dayjs from 'dayjs';
import { FilterType } from '../mock/constants.js';

const isFuturePoint = (point) => dayjs().isBefore(dayjs(point.dateFrom));
const isPresentPoint = (point) =>
  dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));
const isPastPoint = (point) => dayjs().isAfter(dayjs(point.dateTo));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFuturePoint),
  [FilterType.PRESENT]: (points) => points.filter(isPresentPoint),
  [FilterType.PAST]: (points) => points.filter(isPastPoint),
};

const generateFilters = (points) => [
  {
    type: FilterType.EVERYTHING,
    name: 'Everything',
    isDisabled: false,
  },
  {
    type: FilterType.FUTURE,
    name: 'Future',
    isDisabled: filter[FilterType.FUTURE](points).length === 0,
  },
  {
    type: FilterType.PRESENT,
    name: 'Present',
    isDisabled: filter[FilterType.PRESENT](points).length === 0,
  },
  {
    type: FilterType.PAST,
    name: 'Past',
    isDisabled: filter[FilterType.PAST](points).length === 0,
  },
];

export { FilterType, filter, generateFilters };
