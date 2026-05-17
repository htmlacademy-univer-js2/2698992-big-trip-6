export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomValue = (items) => items[getRandomInteger(0, items.length - 1)];

export const sortPointByDay = (pointA, pointB) => {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
};

export const sortPointByTime = (pointA, pointB) => {
  const timeA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const timeB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return timeB - timeA;
};

export const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
