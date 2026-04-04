import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../render.js';

export default class PointsPresenter {
  constructor({pointsEventsContainer, pointsModel}) {
    this.pointsEventsContainer = pointsEventsContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.points];

    render(new SortView(), this.pointsEventsContainer);

    render(new EditFormView({
      point: this.boardPoints[0],
      destination: this.pointsModel.getDestinationById(this.boardPoints[0].destination),
      offers: this.pointsModel.getOffersByType(this.boardPoints[0].type)
    }), this.pointsEventsContainer);

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new PointView({
        point: this.boardPoints[i],
        destination: this.pointsModel.getDestinationById(this.boardPoints[i].destination),
        offers: this.pointsModel.getOffersById(this.boardPoints[i].type, this.boardPoints[i].offers)
      }), this.pointsEventsContainer);
    }
  }
}
