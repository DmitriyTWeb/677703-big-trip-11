import AbstractComponent from "./abstract-component.js";
import {formatDate} from "../utils/common.js";

const createDayInfoContentTemplate = (date, dayNumber) => {
  date = new Date(date);
  return (
    `
    <span class="day__counter">${dayNumber}</span>
    <time class="day__date" datetime="${date.toISOString()}">${formatDate(date)}</time>
    `
  );
};

const createDayTemplate = (date, dayNumber) => {
  const dayInfoContent = (date && dayNumber) ? createDayInfoContentTemplate(date, dayNumber) : ``;
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        ${dayInfoContent}
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, dayNumber) {
    super();

    this._date = date;
    this._dayNumber = dayNumber;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._dayNumber);
  }
}
