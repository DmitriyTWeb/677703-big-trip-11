import AbstractComponent from "./abstract-component.js";
import {formatTime, getDuration} from "../utils.js";

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
  const {category,
    type,
    destination,
    startDate,
    endDate,
    totalPointPrice,
    options,
  } = point;

  const header = `${type} ${category.toLowerCase() === `activity` ? `in` : `to`} ${destination}`;
  const duration = getDuration(startDate, endDate);
  const optionsTemplate = createCheckedOptionsTemplate(options);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${header}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate.toISOString()}">${formatTime(startDate)}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate.toISOString()}">${formatTime(endDate)}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${totalPointPrice}</span>
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
}
