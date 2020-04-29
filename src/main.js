import EventsListComponent from "./components/events-list.js";
import FiltersComponent from "./components/filters.js";
import MenuComponent from "./components/menu.js";
import {options} from "./const.js";
import TripController from "./controllers/trip.js";
import TripInfoComponent from "./components/trip-info.js";
import {render, RenderPosition} from "./utils/render.js";
import {generateFilters} from "./mock/filters.js";
import {generatePoints, destinations} from "./mock/points.js";

const POINTS_COUNT = 22;

const filters = generateFilters();
const points = generatePoints(POINTS_COUNT)
  .slice()
  .sort((first, second) => first.startDate.getTime() - second.startDate.getTime());

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:nth-child(2)`);

render(tripMainElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);
render(menuTitleElement, new MenuComponent(), RenderPosition.AFTER);
render(filterTitleElement, new FiltersComponent(filters), RenderPosition.AFTER);


const pageMainContainerElement = pageMainElement.querySelector(`.page-body__container`);

const eventsListComponent = new EventsListComponent();
render(pageMainContainerElement, eventsListComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(eventsListComponent);
tripController.render(points, destinations, options);
