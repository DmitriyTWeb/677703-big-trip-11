import DayComponent from "../components/day.js";
import NoPointsComponent from "../components/no-points.js";
import {render, RenderPosition} from "../utils/render.js";
import SortComponent, {SortType} from "../components/sort.js";
import PointController, {Mode as PointControllerMode, EmptyTask} from "../controllers/point.js";
import TripDaysComponent from "../components/trip-days.js";
import {isDatesEqual} from "../utils/common.js";
import {FilterType} from "../const.js";


const renderPoints = (container, points, destinations, options, isSortingOn = false, onDataChange, onViewChange) => {
  let currentDay = null;
  let dayCounter = 0;
  let dayComponent = null;
  let dayEventsListElement = null;

  if (isSortingOn) {
    dayComponent = new DayComponent(currentDay, dayCounter);
    render(container, dayComponent, RenderPosition.BEFOREEND);
    dayEventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
  }

  const pointControllers = points.map((point) => {
    if (!isSortingOn) {
      if (!currentDay || !isDatesEqual(currentDay, point.startDate)) {
        dayCounter++;
        currentDay = point.startDate;
        dayComponent = new DayComponent(currentDay, dayCounter);
        render(container, dayComponent, RenderPosition.BEFOREEND);
      }
      dayEventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    }

    const pointController = new PointController(dayEventsListElement, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT, destinations, options);

    return pointController;
  });

  return pointControllers;
};
const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.TIME_DOWN:
      sortedPoints = points.slice()
        .sort((a, b) => {
          const durationA = a.endDate - a.startDate;
          const durationB = b.endDate - b.startDate;

          return durationB - durationA;
        });
      break;
    case SortType.PRICE_DOWN:
      sortedPoints = points.slice()
        .sort((a, b) => b.inputPrice - a.inputPrice);
      break;
    case SortType.EVENT:
      sortedPoints = points.slice()
        .sort((a, b) => a.startDate - b.startDate);
      break;
  }

  return sortedPoints;
};
export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._destinations = null;
    this._allTypesOptions = [];
    this._renderedPointControllers = [];

    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._creatingPoint = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  render(destinations, allTypesOptions) {
    const container = this._container.getElement();
    const points = getSortedPoints(this._pointsModel.getPoints(), SortType.EVENT);

    this._destinations = destinations;
    this._allTypesOptions = allTypesOptions;

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderPoints(getSortedPoints(points, SortType.EVENT));
  }

  _renderPoints(points, isSortingOn = false) {
    const tripDaysElement = this._tripDaysComponent.getElement();
    tripDaysElement.innerHTML = ``;

    this._renderedPointControllers = renderPoints(
        tripDaysElement,
        points,
        this._destinations,
        this._allTypesOptions,
        isSortingOn,
        this._onDataChange, this._onViewChange);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    this._sortComponent.resetSortType();
    this._onSortTypeChange(SortType.EVENT);
    this._onViewChange();
    this._pointsModel.setFilter(FilterType.EVERYTHING);
    this._pointsModel.resetFilter();

    const tripDaysElement = this._tripDaysComponent.getElement();
    this._creatingPoint = new PointController(tripDaysElement, this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyTask, PointControllerMode.ADDING, this._destinations, this._allTypesOptions);
  }

  _removePoints() {
    this._renderedPointControllers.forEach((pointController) => pointController.destroy());
    this._renderedPointControllers = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._updatePoints();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });;
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT, this._destinations, this._allTypesOptions);
            this._updatePoints();
          }
        })
        .catch(() => {
          pointController.shake();
        });;
    }
  }

  _onViewChange() {
    this._renderedPointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortComponent.resetSortType();
    this._updatePoints();
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    const isSortingOn = sortType !== SortType.EVENT ? true : false;
    const dayTitle = this._sortComponent.getElement().querySelector(`.trip-sort__item`);

    if (isSortingOn) {
      dayTitle.innerHTML = ``;
    } else {
      dayTitle.innerHTML = `day`;
    }

    this._removePoints();
    this._renderPoints(sortedPoints, isSortingOn);
  }

  resetSortType() {
    this._onSortTypeChange(SortType.EVENT);
    this._sortComponent.resetSortType();
  }
}
