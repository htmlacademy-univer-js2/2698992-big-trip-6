import PointsPresenter from './presenter/points-presenter.js';
import FilterView from './view/filter-view.js';
import PointsModel from './model/points-model.js';
import { render } from './framework/render.js';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');

const tripControlFilters = pageHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

render(new FilterView(), tripControlFilters);

const pointsModel = new PointsModel();
const pointsPresenter = new PointsPresenter({
  pointsEventsContainer: tripEventsElement,
  pointsModel,
});

pointsPresenter.init();
