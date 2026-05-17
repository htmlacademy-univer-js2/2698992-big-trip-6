import { render } from "../framework/render.js";
import PointPresenter from "./point-presenter.js";
import NoPointView from "../view/no-point-view.js";
import SortView from "../view/sort-view.js";

export default class PointsPresenter {
  #pointsEventsContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();

  constructor({ pointsEventsContainer, pointsModel }) {
    this.#pointsEventsContainer = pointsEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const boardPoints = [...this.#pointsModel.points];

    if (boardPoints.length === 0) {
      render(new NoPointView(), this.#pointsEventsContainer);
      return;
    }

    render(new SortView(), this.#pointsEventsContainer);

    for (const point of boardPoints) {
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
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
