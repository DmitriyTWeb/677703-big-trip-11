import moment from "moment";
import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import {render, replace, RenderPosition, remove} from "../utils/render.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyTask = {
  type: `bus`,
  destination: {},
  startDate: new Date().getTime(),
  endDate: new Date(moment().add(1, `days`).toDate().getTime()),
  inputPrice: ``,
  isFavorite: false,
  options: [],
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
    this._typeOptions = null;
  }

  render(point, mode, destinations, allTypesOptions) {
    this._point = point;
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;


    this._typeOptions = allTypesOptions.find((item) => item.type === point.type);

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, destinations, this._typeOptions ? this._typeOptions : []);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const data = this._pointEditComponent.getData();
      this._onDataChange(this, point, data);
    });

    this._pointEditComponent
        .setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointEditComponent && oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeydown);
        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        this._pointEditComponent.getElement().querySelector(`.event__reset-btn`)
            .textContent = `Cancel`;
        break;
      case Mode.EDIT:
        if (oldPointEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeydown);
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeydown);
    this._pointEditComponent.reset();

    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }

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
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }
}
