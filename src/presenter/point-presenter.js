import { render, replace, remove } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../mock/constants.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, pointsModel, onDataChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#pointsModel.getDestinationById(
        this.#point.destination,
      ),
      offers: this.#pointsModel.getOffersById(
        this.#point.type,
        this.#point.offers,
      ),
      onEditClick: this.#pointEditClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      onRollupClick: this.#rollupClickHandler,
    });

    if (!prevPointComponent || !prevEditFormComponent) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.EDITING) {
      return;
    }

    this.#editFormComponent.reset(this.#point);
    this.#replaceFormToPoint();
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #pointEditClickHandler = () => {
    this.#handleModeChange();
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToPoint();
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #rollupClickHandler = () => {
    this.#editFormComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();
    this.#editFormComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
