import PointsPresenter from './presenter/points-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic eo0w590ik29889a7';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const pageMainElement = document.querySelector('.page-main');
const pageHeaderElement = document.querySelector('.page-header');

const tripControlFiltersElement = pageHeaderElement.querySelector(
  '.trip-controls__filters'
);
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const newEventButtonElement = pageHeaderElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlFiltersElement,
  filterModel,
  pointsModel,
});

const handleNewPointFormClose = () => {
  newEventButtonElement.disabled = false;
};

const pointsPresenter = new PointsPresenter({
  pointsEventsContainer: tripEventsElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const handleNewPointButtonClick = () => {
  pointsPresenter.createPoint();
  newEventButtonElement.disabled = true;
};

filterPresenter.init();
pointsPresenter.init();
pointsModel.init().finally(() => {
  newEventButtonElement.addEventListener('click', handleNewPointButtonClick);
});
