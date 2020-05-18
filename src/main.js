import API from "./api.js";
import EventsListComponent from "./components/events-list.js";
import FilterController from "./controllers/filter.js";
import LoadingComponent from "./components/loading.js";
import PointsModel from "./models/points.js";
import MenuComponent, {MenuItem} from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip.js";
import TripInfoController from "./controllers/trip-info.js";
import {remove, render, RenderPosition} from "./utils/render.js";


const AUTHORIZATION = `Basic [Xy~,MHMVf2auWFD9Jj`;
let destinationsFromServer = [];
let offersFromServer = [];

const pageHeaderElement = document.querySelector(`.page-header`);
const pageMainElement = document.querySelector(`.page-main`);
const tripMainElement = pageHeaderElement.querySelector(`.trip-main`);
const menuTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:first-child`);
const filterTitleElement = pageHeaderElement.querySelector(`.trip-controls > h2:last-child`);
const newEventButton = pageHeaderElement.querySelector(`.trip-main__event-add-btn`);
const pageMainContainerElement = pageMainElement.querySelector(`.page-body__container`);

const menuComponent = new MenuComponent();

const api = new API(AUTHORIZATION);
const pointsModel = new PointsModel();

const tripInfoController = new TripInfoController(tripMainElement, pointsModel);
const filtersController = new FilterController(filterTitleElement, pointsModel);
const eventsListComponent = new EventsListComponent();
const tripController = new TripController(eventsListComponent, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);
const loadingComponent = new LoadingComponent();

render(menuTitleElement, menuComponent, RenderPosition.AFTER);

filtersController.render();
render(pageMainContainerElement, eventsListComponent, RenderPosition.BEFOREEND);
render(pageMainContainerElement, statisticsComponent, RenderPosition.BEFOREEND);

statisticsComponent.hide();

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

render(pageMainContainerElement, loadingComponent, RenderPosition.BEFOREEND);

const getPoints = () => {
  if (destinationsFromServer.length !== 0 && offersFromServer.length !== 0) {
    api.getPoints()
      .then((points) => {
        remove(loadingComponent);
        pointsModel.setPoints(points);
        tripController.render(destinationsFromServer, offersFromServer);
        tripInfoController.render();
      });
  }
};

api.getDesinations()
  .then((destinations) => {
    destinationsFromServer = destinations;
    getPoints();
  });

api.getOffers()
  .then((offers) => {
    offersFromServer = offers;
    getPoints();
  });

