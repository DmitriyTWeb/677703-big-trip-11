import AbstractComponent from "./abstract-component.js";
const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length - 1);
};

const createFilterMarkup = (name, checked) => {
  return (`
    <div class="trip-filters__filter">
        <input
          id="filter-${name}"
          class="trip-filters__filter-input  visually-hidden" type="radio"
          name="trip-filter"
          value="${name}"
          ${checked ? `checked` : ``}
        >
        <label
          class="trip-filters__filter-label"
          for="filter-${name}">${name}
        </label>
    </div>
  `);

};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters
      .map((it) => createFilterMarkup(it.name, it.checked)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }

  resetFilter() {
    this.getElement().querySelector(`#filter-everything`).checked = true;
  }
}
