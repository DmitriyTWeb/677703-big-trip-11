import DayComponent from "../components/day.js";
import NoPointsComponent from "../components/no-points.js";
import {render, RenderPosition} from "../utils/render.js";
import SortComponent, {SortType} from "../components/sort.js";
import PointController from "../controllers/point.js";
import TripDaysComponent from "../components/trip-days.js";
import {isDatesEqual} from "../utils/common.js";


const renderPoints = (container, points, destinations, isSortingOn = false, onDataChange) => {
  let currentDay = null;
  let dayCounter = 0;
  let dayComponent = null;
  let dayEventsListElement = null;

  if (isSortingOn) {
    dayComponent = new DayComponent(currentDay, dayCounter);
    render(container, dayComponent, RenderPosition.BEFOREEND);
    dayEventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
  }

  points.forEach((point) => {
    if (!isSortingOn) {
      if (!currentDay || !isDatesEqual(currentDay, point.startDate)) {
        dayCounter++;
        currentDay = point.startDate;
        dayComponent = new DayComponent(currentDay, dayCounter);
        render(container, dayComponent, RenderPosition.BEFOREEND);
      }
      dayEventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    }

    const pointController = new PointController(dayEventsListElement, onDataChange);
    pointController.render(point, destinations);

  });
};
const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.TIME_DOWN:
      sortedPoints = points
        .slice()
        .sort((a, b) => {
          const durationA = a.endDate.getTime() - a.startDate.getTime();
          const durationB = b.endDate.getTime() - b.startDate.getTime();

          return durationB - durationA;
        });
      break;
    case SortType.PRICE_DOWN:
      sortedPoints = points
        .slice()
        .sort((a, b) => b.totalPointPrice - a.totalPointPrice);
      break;
    case SortType.EVENT:
      sortedPoints = points;
      break;
  }

  return sortedPoints;
};
export default class TripController {
  constructor(container) {
    this._container = container;

    this._points = [];
    this._destinations = null;


    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  render(points, destinations) {
    this._points = points;
    this._destinations = destinations;

    const isSortingOn = false;

    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }
    const tripDaysElement = this._tripDaysComponent.getElement();
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);
    renderPoints(tripDaysElement, points, destinations, isSortingOn, this._onDataChange);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedPoints = getSortedPoints(points, sortType);

      isSortingOn = sortType !== SortType.EVENT ? true : false;
      const dayTitle = this._sortComponent.getElement().querySelector(`.trip-sort__item`);
      if (isSortingOn) {
        dayTitle.innerHTML = ``;
      } else {
        dayTitle.innerHTML = `day`;
      }

      tripDaysElement.innerHTML = ``;

      renderPoints(tripDaysElement, sortedPoints, destinations, isSortingOn, this._onDataChange);
    });
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._points.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._points = []
      .concat(
          this._points.slice(0, index), newData, this._points.slice(index + 1)
      );
    pointController.render(this._points[index], this._destinations);
  }
}
