import EventsListComponent from "./components/events-list.js";
import FilterController from "./controllers/filter.js";
import PointsModel from "./models/points.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import {allTypesOptions} from "./const.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip.js";
import {render, RenderPosition} from "./utils/render.js";
import {generatePoints, destinations} from "./mock/points.js";

import TripInfoController from "./controllers/trip-info.js";


const POINTS_COUNT = 22;

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:last-child`);
const newEventButton = pageHeaderElement.querySelector(`.trip-main__event-add-btn`);
const pageMainContainerElement = pageMainElement.querySelector(`.page-body__container`);

const points = generatePoints(POINTS_COUNT);

const menuComponent = new MenuComponent();

const pointsModel = new PointsModel();
const tripInfoController = new TripInfoController(tripMainElement, pointsModel);
const filtersController = new FilterController(filterTitleElement, pointsModel);
const eventsListComponent = new EventsListComponent();
const tripController = new TripController(eventsListComponent, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(menuTitleElement, menuComponent, RenderPosition.AFTER);
tripInfoController.render();
filtersController.render();
render(pageMainContainerElement, eventsListComponent, RenderPosition.BEFOREEND);
render(pageMainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();

pointsModel.setPoints(points);
tripController.render(destinations, allTypesOptions);

menuComponent.setOnClickHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripController.resetSortType();
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.resetSortType();
      menuComponent.setActiveItem(MenuItem.STATS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});


newEventButton.addEventListener(`click`, () => {
  statisticsComponent.hide();
  tripController.show();

  pointsModel.setFilterResetHandler(filtersController.resetFilter);
  tripController.createPoint();
});
