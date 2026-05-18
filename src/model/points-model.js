import Observable from '../framework/observable.js';
import { generatePoint, mockDestinations, mockOffers } from '../mock/point.js';

const POINT_COUNT = 3;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT_COUNT }, generatePoint);
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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\\\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\\\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
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
