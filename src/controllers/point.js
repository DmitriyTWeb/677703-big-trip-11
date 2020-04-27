import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class Point {
  constructor(container) {
    this._container = container;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(point, destinations) {
    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, destinations);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();

    });

    render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeydown);

    replace(this._pointComponent, this._pointEditComponent);
  }

  _replacePointToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }
}
