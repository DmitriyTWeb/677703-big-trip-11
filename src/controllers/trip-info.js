import {render, replace, RenderPosition} from "../utils/render.js";
import TripInfoComponent from "../components/trip-info.js";


export default class TripInfo {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    if (this._pointsModel.getPointsAll().length === 0) {
      return;
    }
    const container = this._container;
    const oldComponent = this._tripInfoComponent;

    this._tripInfoComponent = new TripInfoComponent(this._pointsModel.getPointsAll());

    if (oldComponent) {
      replace(this._tripInfoComponent, oldComponent);
    } else {
      render(container, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
