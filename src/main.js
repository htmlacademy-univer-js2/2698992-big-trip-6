import PointsPresenter from './presenter/points-presenter.js';
import FilterView from './view/filter-view.js';
import PointsModel from './model/points-model.js';
import { render } from './framework/render.js';
import { FilterType, generateFilters } from './utils/filter.js';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');

const tripControlFilters = pageHeaderElement.querySelector(
  '.trip-controls__filters',
);
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filters = generateFilters(pointsModel.points);

render(
  new FilterView({
    filters,
    currentFilterType: FilterType.EVERYTHING,
  }),
  tripControlFilters,
);

const pointsPresenter = new PointsPresenter({
  pointsEventsContainer: tripEventsElement,
  pointsModel,
});

pointsPresenter.init();
