import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";
import {castTimeFormat} from "../utils/common.js";

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
