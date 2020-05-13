import EventsListComponent from "./components/events-list.js";
import FilterController from "./controllers/filter.js";
import PointsModel from "./models/points.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import {allTypesOptions} from "./const.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip.js";
import TripInfoComponent from "./components/trip-info.js";
import {render, RenderPosition} from "./utils/render.js";
import {generatePoints, destinations} from "./mock/points.js";


const POINTS_COUNT = 22;

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);

const menuComponent = new MenuComponent();
render(menuTitleElement, menuComponent, RenderPosition.AFTER);

const points = generatePoints(POINTS_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:last-child`);
render(tripMainElement, new TripInfoComponent(points), RenderPosition.AFTERBEGIN);

const filtersController = new FilterController(filterTitleElement, pointsModel);
filtersController.render();

const pageMainContainerElement = pageMainElement.querySelector(`.page-body__container`);

const eventsListComponent = new EventsListComponent();
render(pageMainContainerElement, eventsListComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(eventsListComponent, pointsModel);
tripController.render(destinations, allTypesOptions);

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent();
render(pageMainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

menuComponent.setOnClick((menuItem) => {
  console.log(`setOnclick`);
  switch (menuItem) {
    case MenuItem.TABLE:
      console.log(`${menuItem} is pressed`);
      menuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      console.log(`${menuItem} is pressed`);
      menuComponent.setActiveItem(MenuItem.STATS);
      statisticsComponent.show();
      tripController.hide();
      break;
  }
});

const newEventButton = pageHeaderElement.querySelector(`.trip-main__event-add-btn`);
newEventButton.addEventListener(`click`, () => {
  statisticsComponent.hide();
  tripController.show();
  pointsModel.setFilterResetHandler(filtersController.resetFilter);
  tripController.createPoint();
});
