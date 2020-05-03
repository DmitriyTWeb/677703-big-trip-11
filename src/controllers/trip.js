import DayComponent from "../components/day.js";
import NoPointsComponent from "../components/no-points.js";
import {render, RenderPosition} from "../utils/render.js";
import SortComponent, {SortType} from "../components/sort.js";
import PointController from "../controllers/point.js";
import TripDaysComponent from "../components/trip-days.js";
import {isDatesEqual} from "../utils/common.js";


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
    pointController.render(point, destinations, options);

    return pointController;
  });

  return pointControllers;
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
        .sort((a, b) => b.inputPrice - a.inputPrice);
      break;
    case SortType.EVENT:
      sortedPoints = points;
      break;
  }

  return sortedPoints;
};
export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._destinations = null;
    this._typeOptions = [];
    this._renderedPointControllers = [];

    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._noPointsComponent = new NoPointsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(destinations, options) {
    const container = this._container.getElement();
    const points = this._pointsModel.getPoints();

    this._destinations = destinations;
    this._typeOptions = options;

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  _renderPoints(points, isSortingOn = false) {
    const tripDaysElement = this._tripDaysComponent.getElement();
    tripDaysElement.innerHTML = ``;

    this._renderedPointControllers = renderPoints(
        tripDaysElement, points, this._destinations, this._typeOptions, isSortingOn,
        this._onDataChange, this._onViewChange);
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
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

    if (isSuccess) {
      pointController.render(newData, this._destinations, this._typeOptions);
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
}
