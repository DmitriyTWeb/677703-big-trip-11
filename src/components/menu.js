import AbstractComponent from "./abstract-component.js";


export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
        <a class="trip-tabs__btn  trip-tabs__btn--active" id="table" href="#">Table</a>
        <a class="trip-tabs__btn" id="stats" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();

    this.setOnClickHandler = this.setOnClickHandler.bind(this);
    this._activeItem = MenuItem.TABLE;
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setActiveItem(menuItem) {
    const activeClass = `trip-tabs__btn--active`;
    const tabs = Array.from(this.getElement().querySelectorAll(`.trip-tabs__btn`));

    tabs.forEach((tab) => tab.classList.remove(activeClass));

    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      this._activeItem = item.id;
      item.classList.add(activeClass);
    }
  }

  setOnClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.id;
      if (menuItem === this._activeItem) {
        return;
      }
      handler(menuItem);
    });
  }
}
