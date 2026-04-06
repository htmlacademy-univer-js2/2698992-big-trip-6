import EditFormView from "../view/edit-form-view.js";
import NoPointView from "../view/no-point-view.js";
import PointView from "../view/point-view.js";
import SortView from "../view/sort-view.js";
import { render, replace } from "../framework/render.js";

export default class PointsPresenter {
  #pointsEventsContainer = null;
  #pointsModel = null;

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
      let pointComponent = null;
      let editFormComponent = null;

      const onEscKeyDown = (evt) => {
        if (evt.key !== "Escape") {
          return;
        }

        evt.preventDefault();
        replace(pointComponent, editFormComponent);
        document.removeEventListener("keydown", onEscKeyDown);
      };

      pointComponent = new PointView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersById(point.type, point.offers),
        onEditClick: () => {
          replace(editFormComponent, pointComponent);
          document.addEventListener("keydown", onEscKeyDown);
        },
      });

      editFormComponent = new EditFormView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersByType(point.type),
        onFormSubmit: () => {
          replace(pointComponent, editFormComponent);
          document.removeEventListener("keydown", onEscKeyDown);
        },
        onRollupClick: () => {
          replace(pointComponent, editFormComponent);
          document.removeEventListener("keydown", onEscKeyDown);
        },
      });

      render(pointComponent, this.#pointsEventsContainer);
    }
  }
}
