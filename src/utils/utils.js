import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

export const formatDate = (date, format) => date ? dayjs(date).format(format) : '';

export const calculateDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const durationObj = dayjs.duration(diff);
  const days = Math.floor(durationObj.asDays());
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    return `${minutes.toString().padStart(2, '0')}M`;
  }
};

export const sortPointByDay = (pointA, pointB) =>
  new Date(pointA.dateFrom) - new Date(pointB.dateFrom);


export const sortPointByTime = (pointA, pointB) => {
  const timeA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const timeB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return timeB - timeA;
};

export const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
