import AbstractSmartComponent from "./abstract-smart-component.js";
import {capitalizeFirstLetter} from "../utils/common.js";
import {getPointCategory} from "../utils/common.js";
import {encode} from "he";
import flatpickr from "flatpickr";
import {pointTypes} from "../const.js";

import "flatpickr/dist/flatpickr.min.css";

const createEventTypeItemGroup = (types, currentType) => {
  return types.map((type) => {
    type = type.toLowerCase();
    return (
      `<div class="event__type-item">
        <input
          id="event-type-${type}-1"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${(currentType === type) ? `checked` : ``}
        >
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`
    );
  }).join(`\n`);
};
const createDestinationTemplate = (destination) => {
  return (
    `<option value="${capitalizeFirstLetter(destination)}"></option>`
  );
};
const createOtionTemplate = (option, checked) => {
  const {title, price} = option;
  const name = title.split(` `).join(`-`);

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${name}-1"
        type="checkbox"
        name="event-offer-${name}"
        ${checked ? `checked` : ``}
      >
      <label class="event__offer-label" for="event-offer-${name}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOtionsTemplate = (typeOptions, pointOptions) => {
  if (!typeOptions || typeOptions.length === 0) {
    return ``;
  }

  const optionsTemplate = typeOptions.map((typeOption) => {
    const checked = pointOptions.some((pointOption) => pointOption.title === typeOption.title);
    return createOtionTemplate(typeOption, checked);
  }).join(`\n`);

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${optionsTemplate}
      </div>
    </section>`
  );
};

const createPicturesTemplate = (pictures) => {
  if (!pictures || pictures.length === 0) {
    return ``;
  }
  return pictures.map((picture) => {
    return (
      `<img class="event__photo" src="${picture.src}" alt="Event photo">`
    );
  }).join(`\n`);
};

const createDestinationDetailsTemplate = (destination) => {
  if (typeof destination !== `object` || !destination.hasOwnProperty(`description`) ||
    destination.description === ``) {
    return ``;
  }

  const imagesTemplate = createPicturesTemplate(destination.pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${imagesTemplate}
        </div>
      </div>
    </section>`
  );
};

const createEditPointTemplate = (point, destinations, allTypesOptions) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    inputPrice,
    isFavorite,
    options,
  } = point;

  const activityTypes = pointTypes.filter((currentType) => {
    return getPointCategory(currentType) === `activity`;
  });
  const transferTypes = pointTypes.filter((currentType) => {
    return getPointCategory(currentType) === `transfer`;
  });

  const pointCategory = getPointCategory(type);
  const typeOptions = allTypesOptions.find((item) => item.type === point.type);

  const transferItemsTemplate = createEventTypeItemGroup(transferTypes, type);
  const activityItemsTemplate = createEventTypeItemGroup(activityTypes, type);
  const header = `${capitalizeFirstLetter(type)} ${pointCategory.toLowerCase() === `activity` ? `in` : `to`}`;
  const destinationList = destinations.map((it) => createDestinationTemplate(it.name)).join(`\n`);
  const destinationName = destination.hasOwnProperty(`name`) ? destination.name : ``;

  const isFavoriteChecked = isFavorite ? `checked` : ``;
  const offersTemplate = createOtionsTemplate(typeOptions.options, options);
  const destinationDetailsTemplate = createDestinationDetailsTemplate(destination);

  return (
    `<li class="trip-events__item">
      <form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${transferItemsTemplate}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${activityItemsTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${header}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1" type="text"
              name="event-destination"
              value="${capitalizeFirstLetter(destinationName)}" list="destination-list-1"
              required
            >
            <datalist id="destination-list-1">
              ${destinationList}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${startDate}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${endDate}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${inputPrice}" required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavoriteChecked}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          ${offersTemplate}
          ${destinationDetailsTemplate}
        </section>
      </form>
    </li>`
  );
};

export default class EditPoint extends AbstractSmartComponent {
  constructor(point, destinations, allTypesOptions) {
    super();

    this._point = point;
    this._destinations = destinations;
    this._allTypesOptions = allTypesOptions;
    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._deleteButtonClickHandler = null;

    this._submitHandler = null;
    this._favoriteHandler = null;
    this._typeChangeHandler = null;
    this._destinationChangeHandler = null;
    this._priceChangeHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, this._destinations, this._allTypesOptions);
  }

  removeElement() {
    if (this._flatpickrStart || this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrEnd.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  recoveryListener() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`form`);
    return new FormData(form);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {

    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);

    this._favoriteHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickrStart || this._flatpickrEnd) {
      this._flatpickrStart.destroy();
      this._flatpickrEnd.destroy();
      this._flatpickrStart = null;
      this._flatpickrEnd = null;
    }

    const startDateElement = this.getElement().querySelector(`[name="event-start-time"]`);
    this._flatpickrStart = flatpickr(startDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      dateFormat: `U`,

      defaultDate: this._point.startDate || `today`
    });

    const endDateElement = this.getElement().querySelector(`[name="event-end-time"]`);
    this._flatpickrEnd = flatpickr(endDateElement, {
      altInput: true,
      allowInput: true,
      enableTime: true,
      altFormat: `d/m/Y H:i`,
      dateFormat: `U`,

      defaultDate: this._point.endDate || `today`
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const radioButtons = element.querySelectorAll(`[name="event-type"]`);
    Array.from(radioButtons).forEach((button) => {
      button.addEventListener(`change`, (evt) => {
        const newType = evt.target.value;
        this._point.type = newType;

        this.rerender();
      });
    });

    element.querySelector(`[name="event-price"]`)
      .addEventListener(`change`, (evt) => {
        const newPrice = encode(evt.target.value);

        if (newPrice === `` || isNaN(newPrice)) {
          evt.target.setCustomValidity(`Please input correct price`);
          return;
        }
        this._point.inputPrice = newPrice;

        this.rerender();
      });

    element.querySelector(`[name="event-destination"]`)
      .addEventListener(`change`, (evt) => {
        const inputDestination = encode(evt.target.value);
        if (!this._destinations.some((item) => item.name === inputDestination)) {
          evt.target.setCustomValidity(`Please choose one destination from the List`);
          return;
        }
        const newDestination = this._destinations.find((item) => item.name === encode(evt.target.value));
        this._point.destination = newDestination;

        this.rerender();
      });
  }
}
