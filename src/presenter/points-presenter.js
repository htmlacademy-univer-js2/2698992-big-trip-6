import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import NoPointView from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import { SortType } from '../mock/constants.js';
import { sortPointByDay, sortPointByTime, sortPointByPrice } from '../utils/utils.js';

export default class PointsPresenter {
  #pointsEventsContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #boardPoints = [];
  #sourcedBoardPoints = [];
  #sortComponent = null;

  constructor({ pointsEventsContainer, pointsModel }) {
    this.#pointsEventsContainer = pointsEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#pointsEventsContainer);
      return;
    }

    this.#sortPoints(this.#currentSortType);
    this.#renderSort();

    for (const point of this.#boardPoints) {
      this.#renderPoint(point);
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#pointsEventsContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortPointByDay);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointByPrice);
        break;
      default:
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointList() {
    for (const point of this.#boardPoints) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointsEventsContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = this.#boardPoints.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#sourcedBoardPoints = this.#sourcedBoardPoints.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

