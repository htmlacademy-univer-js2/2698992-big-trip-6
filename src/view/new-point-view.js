import EditPointView from './edit-point-view.js';

export default class NewPointView extends EditPointView {
  constructor(options = {}) {
    super({ ...options, point: null });
  }
}
