import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";
import {castTimeFormat} from "../utils/common.js";

const createDayInfoContentTemplate = (date, dayNumber) => {
  const month = MONTHS[date.getMonth()];

  return (
    `
    <span class="day__counter">${dayNumber}</span>
    <time class="day__date" datetime="${date.toISOString()}">${month} ${castTimeFormat(date.getDate())}</time>
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
