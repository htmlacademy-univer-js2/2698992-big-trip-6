import { render, replace, remove, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { sortPointByDay, formatDate } from '../utils/utils.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.points;
    const destinations = this.#pointsModel.destinations;

    // We only show trip info if points exist
    if (points.length === 0 || destinations.length === 0) {
      if (this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const sortedPoints = [...points].sort(sortPointByDay);

    const route = this.#calculateRoute(sortedPoints, destinations);
    const dates = this.#calculateDates(sortedPoints);
    const cost = this.#calculateCost(points);

    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      route,
      dates,
      cost
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #calculateRoute(points, destinations) {
    const destinationNames = points.map((point) => {
      const destination = destinations.find((dest) => dest.id === point.destination);
      return destination ? destination.name : '';
    }).filter((name) => name !== '');

    if (destinationNames.length === 0) {
      return '';
    }

    if (destinationNames.length > 3) {
      return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
    }

    return destinationNames.join(' &mdash; ');
  }

  #calculateDates(points) {
    if (points.length === 0) {
      return '';
    }

    const firstDate = formatDate(points[0].dateFrom, 'MMM DD');
    const lastDate = formatDate(points[points.length - 1].dateTo, 'MMM DD');

    if (firstDate === lastDate) {
      return firstDate;
    }

    return `${firstDate}&nbsp;&mdash;&nbsp;${lastDate}`;
  }

  #calculateCost(points) {
    return points.reduce((totalCost, point) => {
      const pointBasePrice = point.basePrice || 0;

      const offers = this.#pointsModel.getOffersById(point.type, point.offers) || [];
      const offersCost = offers.reduce((total, offer) => total + (offer.price || 0), 0);

      return totalCost + pointBasePrice + offersCost;
    }, 0);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
