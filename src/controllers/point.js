import {getTypeOptions} from "../utils/common.js";
import {encode} from "he";
import moment from "moment";
import PointComponent from "../components/point.js";
import PointEditComponent from "../components/point-edit.js";
import PointModel from "../models/point.js";
import {render, replace, RenderPosition, remove} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  type: `bus`,
  destination: {},
  startDate: new Date().getTime(),
  endDate: new Date(moment().add(1, `days`).toDate().getTime()),
  inputPrice: ``,
  isFavorite: false,
  options: [],
};

const getOptionByFormKey = (allOptions, key) => {
  const offerPrefix = `event-offer-`;
  const title = key.substring(offerPrefix.length).split(`-`).join(` `);

  return allOptions.find((item) => {
    return item.title === title;
  });
};

const parseFormData = (formData, destinations, allTypesOptions) => {
  const type = formData.get(`event-type`);
  const typeOptions = getTypeOptions(allTypesOptions, type);
  const destinationFromForm = encode(formData.get(`event-destination`));
  const startDate = parseInt(encode(formData.get(`event-start-time`)), 10) * 1000;
  const endDate = parseInt(encode(formData.get(`event-end-time`)), 10) * 1000;
  const inputPrice = parseInt(encode(formData.get(`event-price`)), 10);

  const destination = destinations.find((item) => item.name === destinationFromForm);

  let isFavorite = false;
  let options = [];

  for (const [key] of formData.entries()) {
    if (/event-offer\w*/.test(key)) {
      options.push(getOptionByFormKey(typeOptions, key));
    }
    if (key === `event-favorite`) {
      isFavorite = true;
    }
  }

  return new PointModel({
    "type": type,
    "destination": destination,
    "date_from": new Date(startDate).toISOString(),
    "date_to": new Date(endDate).toISOString(),
    "base_price": inputPrice,
    "is_favorite": isFavorite,
    "offers": options
  });

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
    this._allTypesOptions = null;
  }

  render(point, mode, destinations, allTypesOptions) {
    this._point = point;
    this._allTypesOptions = allTypesOptions;

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;
    this._mode = mode;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, destinations, this._allTypesOptions);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._pointEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const form = this._pointEditComponent.getElement().querySelector(`form`);
      if (form.classList.contains(`error-border`)) {
        form.classList.remove(`error-border`);
      }
      const formData = this._pointEditComponent.getData();
      const data = parseFormData(formData, destinations, this._allTypesOptions);

      this._pointEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._pointEditComponent.disableForm(true);

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      this._pointEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._pointEditComponent.disableForm(true);

      this._onDataChange(this, point, null);
    });

    this._pointEditComponent.setFavoriteButtonClickHandler(() => {
      if (!point.id) {
        return;
      }
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;

      this._onDataChange(this, point, newPoint);
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

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointComponent.getElement().style.animation = ``;

      this._pointEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._pointEditComponent.getElement().querySelector(`form`)
        .classList.add(`error-border`);
      this._pointEditComponent.disableForm(false);
    }, SHAKE_ANIMATION_TIMEOUT);
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
        this._onDataChange(this, EmptyPoint, null);
      }

      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }
}
