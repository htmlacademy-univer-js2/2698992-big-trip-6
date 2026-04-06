import AbstractView from "../framework/view/abstract-view.js";
import { TYPES, CITIES } from "../mock/constants.js";

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: "",
  id: "",
  isFavorite: false,
  offers: [],
  type: TYPES[0],
};

function createTypeTemplate(currentType) {
  return TYPES.map(
    (type) =>
      `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? "checked" : ""}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>`,
  ).join("");
}

function createDestinationTemplate() {
  return CITIES.map((city) => `<option value="${city}"></option>`).join("");
}

function createOfferTemplate(offer, isChecked) {
  return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? "checked" : ""}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
}

function createOffersSection(availableOffers, selectedOfferIds) {
  if (!availableOffers || availableOffers.length === 0) {
    return "";
  }

  const offersTemplate = availableOffers
    .map((offer) =>
      createOfferTemplate(offer, selectedOfferIds.includes(offer.id)),
    )
    .join("");

  return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersTemplate}
      </div>
    </section>`;
}

function createDestinationSection(destination) {
  if (!destination) {
    return "";
  }

  const picturesTemplate = destination.pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`,
    )
    .join("");

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

function createEditFormTemplate(point, destination, availableOffers) {
  const { type, basePrice, offers } = point;

  const typeListTemplate = createTypeTemplate(type);
  const destinationListTemplate = createDestinationTemplate();
  const offersSectionTemplate = createOffersSection(availableOffers, offers);
  const destinationSectionTemplate = createDestinationSection(destination);

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ""}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
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

export default class EditFormView extends AbstractView {
  #point = BLANK_POINT;
  #destination = null;
  #offers = null;
  #onFormSubmit = null;
  #onRollupClick = null;

  constructor({
    point = BLANK_POINT,
    destination,
    offers,
    onFormSubmit,
    onRollupClick,
  }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this.element
      .querySelector(".event--edit")
      .addEventListener("submit", this.#formSubmitHandler);
    this.element
      .querySelector(".event__rollup-btn")
      .addEventListener("click", this.#rollupClickHandler);
  }

  get template() {
    return createEditFormTemplate(this.#point, this.#destination, this.#offers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit?.();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };
}
