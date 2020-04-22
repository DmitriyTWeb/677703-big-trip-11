import AbstractComponent from "./abstract-component.js";

export const SortType = {
  TIME_DOWN: `time-down`,
  PRICE_DOWN: `price-down`,
  DEFAULT: `event`,
};

const createDayTitle = () {
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
        <input id="sort-event" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.DEFAULT}" type="radio" name="trip-sort" value="sort-event">
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.TIME_DOWN}" type="radio" name="trip-sort" value="sort-time" checked>
        <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
          Time
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" data-sort-type="${SortType.PRICE_DOWN}" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" for="sort-price">
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

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      console.log(`evt.target.tagName = `, evt.target.tagName);

      // if (evt.target.tagName !== `input`) {
      //   return;
      // }

      // const sortType = evt.target.dataset.sortType;

      // if (this._currentSortType === sortType) {
      //   return;
      // }

      // this._currentSortType = sortType;

      // handler(this._currentSortType);
    });
  }
}
