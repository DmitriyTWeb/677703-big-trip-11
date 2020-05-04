import AbstractComponent from "./abstract-component.js";
import {capitalizeFirstLetter, formatTime, getDuration, getPointCategory} from "../utils/common.js";

const createCheckedOptionsTemplate = (options) => {
  return options.map((option) => {
    const {title, price} = option;

    return (
      `<li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`);
  }).join(`\n`);

};

const createPointTemplate = (point) => {
  const {
    type,
    destination,
    startDate,
    endDate,
    inputPrice,
    options,
  } = point;
  const pointCategory = getPointCategory(type);
  const destinationName = destination.hasOwnProperty(`name`) ? destination.name : ``;

  const header = `${capitalizeFirstLetter(type)} ${pointCategory.toLowerCase() === `activity` ? `in` : `to`} ${capitalizeFirstLetter(destinationName)}`;
  const duration = getDuration(startDate, endDate);
  const optionsTemplate = createCheckedOptionsTemplate(options);
  const startTime = new Date(startDate);
  const endTime = new Date(endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${header}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTime.toISOString()}">${formatTime(startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTime.toISOString()}">${formatTime(endTime)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${inputPrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${optionsTemplate}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};


export default class Point extends AbstractComponent {
  constructor(point) {
    super();

    this._point = point;
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setRollupButtonClickHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, cb);
  }
}
