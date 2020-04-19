import {MONTHS} from "../const.js";
import {castTimeFormat, createElement} from "../utils.js";

const createDayTemplate = (date, dayNumber) => {
  const month = MONTHS[date.getMonth()];

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${date.toISOString()}">${month} ${castTimeFormat(date.getDate())}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class Day {
  constructor(date, dayNumber) {
    this._date = date;
    this._dayNumber = dayNumber;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._dayNumber);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
