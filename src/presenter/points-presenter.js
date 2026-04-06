import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import { render, replace } from '../framework/render.js';

export default class PointsPresenter {
  #pointsEventsContainer = null;
  #pointsModel = null;

  constructor({ pointsEventsContainer, pointsModel }) {
    this.#pointsEventsContainer = pointsEventsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const boardPoints = [...this.#pointsModel.points];

    render(new SortView(), this.#pointsEventsContainer);

    for (const point of boardPoints) {
      const components = {
        pointComponent: null,
        editFormComponent: null,
      };

      const onEscKeyDown = (evt) => {
        if (evt.key !== 'Escape') {
          return;
        }

        evt.preventDefault();
        replace(components.pointComponent, components.editFormComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      };

      components.editFormComponent = new EditFormView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersByType(point.type),
        onFormSubmit: () => {
          replace(components.pointComponent, components.editFormComponent);
          document.removeEventListener('keydown', onEscKeyDown);
        },
        onRollupClick: () => {
          replace(components.pointComponent, components.editFormComponent);
          document.removeEventListener('keydown', onEscKeyDown);
        },
      });

      components.pointComponent = new PointView({
        point,
        destination: this.#pointsModel.getDestinationById(point.destination),
        offers: this.#pointsModel.getOffersById(point.type, point.offers),
        onEditClick: () => {
          replace(components.editFormComponent, components.pointComponent);
          document.addEventListener('keydown', onEscKeyDown);
        },
      });

      render(components.pointComponent, this.#pointsEventsContainer);
    }
  }
}
