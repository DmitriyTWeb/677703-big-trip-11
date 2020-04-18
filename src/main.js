import DayComponent from "./components/day.js";
import EditPointComponent from "./components/edit-point.js";
import FiltersComponent from "./components/filters.js";
import PointComponent from "./components/point.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import TripDaysComponent from "./components/trip-days.js";
import TripInfoComponent from "./components/trip-info.js";

import {render, RenderPosition, isDatesEqual} from "./utils.js";
import {generateFilters} from "./mock/filters.js";
import {generatePoints} from "./mock/points.js";

const POINTS_COUNT = 22;

const filters = generateFilters();
const points = generatePoints(POINTS_COUNT).slice().sort((first, second) => first.startDate.getTime() - second.startDate.getTime());

const pageHeaderElement = document.querySelector(`.page-header`);
const mainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:nth-child(2)`);

render(mainElement, new TripInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);
render(menuTitleElement, new MenuComponent().getElement(), RenderPosition.AFTER);
render(filterTitleElement, new FiltersComponent(filters).getElement(), RenderPosition.AFTER);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEventsElement, new TripDaysComponent().getElement(), RenderPosition.BEFOREEND);

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);

const renderPoint = (dayEventsListElement, point) => {
  const editPointComponent = new EditPointComponent(point);
  const pointComponent = new PointComponent(point);
  const rollupButton = pointComponent.getElement().querySelector(`.event__rollup-btn`);
  const editForm = editPointComponent.getElement();

  const replacePointToEdit = () => {
    dayEventsListElement.replaceChild(editPointComponent.getElement(), pointComponent.getElement());
  };

  const replaceEditToPoint = () => {
    dayEventsListElement.replaceChild(pointComponent.getElement(), editPointComponent.getElement());
  };
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  rollupButton.addEventListener(`click`, () => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
  });

  render(dayEventsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

let currentDay = null;
let dayCounter = 0;
let dayElement = null;

points.forEach((point) => {
  if (!currentDay || !isDatesEqual(currentDay, point.startDate)) {
    dayCounter++;
    currentDay = point.startDate;
    dayElement = new DayComponent(currentDay, dayCounter).getElement();
    render(tripDaysListElement, dayElement, RenderPosition.BEFOREEND);
  }
  let dayEventsListElement = dayElement.querySelector(`.trip-events__list`);
  renderPoint(dayEventsListElement, point);
});
