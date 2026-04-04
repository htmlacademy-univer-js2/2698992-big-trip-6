import { generatePoint, mockDestinations, mockOffers } from '../mock/point.js';

const POINT_COUNT = 3;

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, generatePoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const allOffers = this.#offers.find((offer) => offer.type === type);
    return allOffers ? allOffers.offers : [];
  }

  getOffersById(type, offerIds) {
    const offersByType = this.getOffersByType(type);
    return offersByType.filter((offer) => offerIds.includes(offer.id));
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
