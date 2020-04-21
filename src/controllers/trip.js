import DayComponent from "../components/day.js";
import EditPointComponent from "../components/edit-point.js";
import PointComponent from "../components/point.js";
import NoPointsComponent from "../components/no-points.js";
import {render, RenderPosition} from "../utils/render.js";
import SortComponent from "../components/sort.js";
import TripDaysComponent from "../components/trip-days.js";
import {isDatesEqual} from "../utils/common.js";

const renderPoint = (dayEventsListElement, point) => {
  const pointComponent = new PointComponent(point);
  const editPointComponent = new EditPointComponent(point);

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
  pointComponent.setRollupButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });
  editPointComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayEventsListElement, pointComponent, RenderPosition.BEFOREEND);
};

const renderEvents = (container, points) => {
  let currentDay = null;
  let dayCounter = 0;
  let dayComponent = null;

  points.forEach((point) => {
    if (!currentDay || !isDatesEqual(currentDay, point.startDate)) {
      dayCounter++;
      currentDay = point.startDate;
      dayComponent = new DayComponent(currentDay, dayCounter);
      render(container, dayComponent, RenderPosition.BEFOREEND);
    }
    let dayEventsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    renderPoint(dayEventsListElement, point);
  });
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._sortComponent = new SortComponent();
    this._tripDaysComponent = new TripDaysComponent();
    this._noPointsComponent = new NoPointsComponent();
  }

  render(points) {
    const container = this._container.getElement();
    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    if (points.length === 0) {
      render(container, this._noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._tripDaysComponent, RenderPosition.BEFOREEND);

    renderEvents(this._tripDaysComponent.getElement(), points);
  }
}
