import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES, CITIES } from '../mock/constants.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { formatDate } from '../utils/utils.js';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: '',
  id: '',
  isFavorite: false,
  offers: [],
  type: TYPES[0],
};

function createTypeTemplate(currentType) {
  return TYPES.map(
    (type) =>
      `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>`,
  ).join('');
}

function createDestinationTemplate(destinations) {
  return destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
}

function createOfferTemplate(offer, isChecked) {
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
}

function createOffersSection(availableOffers, selectedOfferIds) {
  if (!availableOffers || availableOffers.length === 0) {
    return '';
  }

  const offersTemplate = availableOffers
    .map((offer) =>
      createOfferTemplate(offer, selectedOfferIds.includes(offer.id)),
    )
    .join('');

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`;
}

function createDestinationSection(destination) {
  if (!destination) {
    return '';
  }

  const picturesTemplate = destination.pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`,
    )
    .join('');

  return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesTemplate}
        </div>
      </div>
    </section>`;
}

function createEditFormTemplate(state, destinations, allOffers) {
  const { type, basePrice, offers } = state;

  const currentDestination = destinations.find((dest) => dest.id === state.destination);
  const currentOffers = allOffers.find((offer) => offer.type === type)?.offers || [];

  const typeListTemplate = createTypeTemplate(type);
  const destinationListTemplate = createDestinationTemplate(destinations);
  const offersSectionTemplate = createOffersSection(currentOffers, offers);
  const destinationSectionTemplate = createDestinationSection(currentDestination);

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typeListTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(state.dateFrom, 'DD/MM/YY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(state.dateTo, 'DD/MM/YY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" step="1" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${state.id === '' ? 'Cancel' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${state.id === '' ? 'style="display:none;"' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersSectionTemplate}
          ${destinationSectionTemplate}
        </section>
      </form>
    </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #onFormSubmit = null;
  #onDeleteClick = null;
  #onRollupClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    point = BLANK_POINT,
    destinations,
    offers,
    onFormSubmit,
    onDeleteClick,
    onRollupClick,
  }) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onDeleteClick = onDeleteClick;
    this.#onRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);
    this.element
      .querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    
    const availableOffersContainer = this.element.querySelector('.event__available-offers');
    if (availableOffersContainer) {
      availableOffersContainer.addEventListener('change', this.#offerChangeHandler);
    }
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point),
    );
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    if (!selectedDestination) {
      evt.target.value = '';
      return;
    }
    this.updateElement({
      destination: selectedDestination.id,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedBoxes.map((element) => element.id.split('-').slice(-2, -1)[0])
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: parseInt(evt.target.value, 10) || 0,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (!this._state.destination || !this._state.basePrice) {
      return;
    }
    this.#onFormSubmit?.(EditFormView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick?.(EditFormView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    return point;
  }
}
