import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class Point {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._point = null;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(point, destinations, options) {
    this._point = point;
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    const typeOptions = options.filter((option) => option.type === point.type);

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, destinations, typeOptions);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      this._replaceEditToPoint();
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    this._pointEditComponent.setPointTypeChangeHandler((newType, newCategory) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        category: newCategory,
        type: newType,
      }));
    });

    this._pointEditComponent.setDestinationChangeHandler((newDestination, newDescription) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        destination: newDestination,
        description: newDescription,
      }));
    });

    this._pointEditComponent.setEventPriceChangeHandler((newPrice) => {
      this._onDataChange(this, point, Object.assign({}, point, {
        inputPrice: newPrice,
      }));
    });

    if (oldPointEditComponent && oldPointComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._pointEditComponent.reset();
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEditComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }
}
