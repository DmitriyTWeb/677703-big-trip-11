const POINT_COUNT = 3;

import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createMenuTemplate} from "./components/menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEventFormTemplate} from "./components/event-form.js";
import {createTripDaysTemplate} from "./components/trip-days.js";
import {createTripDaysItemTemplate} from "./components/trip-days-item.js";
import {createPointTemplate} from "./components/point.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeaderElement = document.querySelector(`.page-header`);
const mainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:nth-child(2)`);

render(mainElement, createTripInfoTemplate(), `afterBegin`);

const tripInfoElement = mainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripCostTemplate());
render(menuTitleElement, createMenuTemplate(), `afterend`);
render(filterTitleElement, createFilterTemplate(), `afterend`);

const pageMainElement = document.querySelector(`.page-main`);
const tripEventsElement = pageMainElement.querySelector(`.trip-events`);

render(tripEventsElement, createSortingTemplate());
render(tripEventsElement, createEventFormTemplate());
render(tripEventsElement, createTripDaysTemplate());

const tripDaysListElement = tripEventsElement.querySelector(`.trip-days`);
render(tripDaysListElement, createTripDaysItemTemplate());

const tripDaysItemElement = tripDaysListElement.querySelector(`.day`);
const tripEventsListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_COUNT; i++) {
  render(tripEventsListElement, createPointTemplate());
}


