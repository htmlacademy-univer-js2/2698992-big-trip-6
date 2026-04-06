import { getRandomInteger, getRandomValue } from "../utils/utils.js";
import { TYPES, CITIES, DESCRIPTIONS } from "./constants.js";

const mockDestinations = [
  {
    id: 1,
    description: `${getRandomValue(DESCRIPTIONS)} ${getRandomValue(DESCRIPTIONS)}`,
    name: CITIES[0],
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
        description: `Random photo of ${CITIES[0]}`,
      },
    ],
  },
  {
    id: 2,
    description: `${getRandomValue(DESCRIPTIONS)} ${getRandomValue(DESCRIPTIONS)}`,
    name: CITIES[1],
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
        description: `Random photo of ${CITIES[1]}`,
      },
    ],
  },
  {
    id: 3,
    description: getRandomValue(DESCRIPTIONS),
    name: CITIES[2],
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
        description: `Random photo of ${CITIES[2]}`,
      },
    ],
  },
];

const mockOffers = [
  {
    type: "taxi",
    offers: [
      {
        id: 1,
        title: "Order Uber",
        price: 20,
      },
      {
        id: 2,
        title: "Choose comfort",
        price: 35,
      },
    ],
  },
  {
    type: "flight",
    offers: [
      {
        id: 1,
        title: "Add luggage",
        price: 50,
      },
      {
        id: 2,
        title: "Switch to comfort",
        price: 80,
      },
    ],
  },
  {
    type: "train",
    offers: [
      {
        id: 1,
        title: "Add meal",
        price: 15,
      },
    ],
  },
];

const getRandomOffers = (type) => {
  const offersByType = mockOffers.find((offer) => offer.type === type);
  if (!offersByType) {
    return [];
  }
  return offersByType.offers
    .map((offer) => offer.id)
    .slice(0, getRandomInteger(1, offersByType.offers.length));
};

const getRandomDestinationId = () => getRandomValue(mockDestinations).id;

const generatePoint = () => {
  const type = getRandomValue(TYPES);
  const destinationId = getRandomDestinationId();
  return {
    basePrice: getRandomInteger(100, 1500),
    dateFrom: new Date("2019-07-10T22:55:56.845Z"),
    dateTo: new Date("2019-07-11T11:22:13.375Z"),
    destination: destinationId,
    id: String(getRandomInteger(1, 1000)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomOffers(type),
    type,
  };
};

export { generatePoint, mockDestinations, mockOffers };
