import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, name, isDisabled } = filter;

  return `<div class="trip-filters__filter">
          <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
        </div>`;
}

function createFilterTemplate(filters, currentFilterType) {
  const filtersTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filtersTemplate}

        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`;
}

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
