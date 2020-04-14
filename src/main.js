import {createTripInfoTemplate} from "./components/trip-info.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFiltersTemplate} from "./components/filters.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEditPointTemplate} from "./components/edit-point.js";
import {createTripDaysTemplate} from "./components/trip-days.js";

// import {createTripDaysItemTemplate} from "./components/trip-days-item.js";
import {createEventsTemplate} from "./components/events.js";

// import {createPointTemplate} from "./components/point.js";

import {getRoute, getTotalCost} from "./utils.js";
import {generateFilters} from "./mock/filters.js";
import {generatePoints} from "./mock/points.js";

const POINTS_COUNT = 22;

const filters = generateFilters();
const points = generatePoints(POINTS_COUNT).slice().sort((first, second) => first.startDate.getTime() - second.startDate.getTime());
const routeInfo = getRoute(points);
const totalCost = getTotalCost(points);

// console.log(points);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const mainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:nth-child(2)`);

render(mainElement, createTripInfoTemplate(routeInfo, totalCost), `afterBegin`);
render(menuTitleElement, createMenuTemplate(), `afterend`);
render(filterTitleElement, createFiltersTemplate(filters), `afterend`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createSortingTemplate());
render(tripEventsElement, createEditPointTemplate(points[0]));
render(tripEventsElement, createTripDaysTemplate());

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);

render(tripDaysListElement, createEventsTemplate(points.slice(1)));

// for (let i = 1; i < POINTS_COUNT; i++) {
//   // render(tripEventsListElement, createPointTemplate(points[i]));

//   // render(tripDaysListElement, createTripDaysItemTemplate(points[1].startDate, 1));
// }


