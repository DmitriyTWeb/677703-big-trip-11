import AbstractComponent from "./abstract-component.js";

export const SortType = {
  TIME_DOWN: `time-down`,
  PRICE_DOWN: `price-down`,
  EVENT: `event`,
};

const createDayTitle = () => {
  return (
    `<span class="trip-sort__item  trip-sort__item--day">day</span>`
  );
};
const createSortingTemplate = () => {
  const dayTitle = createDayTitle();
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${dayTitle}

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event"  checked>
        <label class="trip-sort__btn" data-sort-type="${SortType.EVENT}" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" data-sort-type="${SortType.TIME_DOWN}" for="sort-time">
          Time
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" data-sort-type="${SortType.PRICE_DOWN}" for="sort-price">
          Price
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.default;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  resetSortType() {
    this._currentSortType = SortType.EVENT;
    this.getElement().querySelector(`#sort-event`).checked = true;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;


      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
