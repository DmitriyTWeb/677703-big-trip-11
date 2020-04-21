import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../const.js";

const sortPoints = (points) => {
  // сортирует точки по дате от меньшей к большей
  return points
    .slice()
    .sort((first, second) => first.startDate - second.startDate);
};
const getDestinations = (points) => {
  const sortedPoints = sortPoints(points);
  return sortedPoints.map((point) => point.destination);
};
const getRouteDates = (points) => {
  if (points.length === 0) {
    return ``;
  }
  const sortedPoints = sortPoints(points);

  const startDate = sortedPoints[0].startDate;
  const endDate = sortedPoints[sortedPoints.length - 1].endDate;
  let routeDates = ``;

  if (startDate.getMonth() === endDate.getMonth()) {
    routeDates = `${MONTHS[startDate.getMonth()].toUpperCase()} ${startDate.getDate()} — ${endDate.getDate()}`;
  } else {
    routeDates = `${MONTHS[startDate.getMonth()].toUpperCase()} ${startDate.getDate()} — ${MONTHS[endDate.getMonth()].toUpperCase()} ${endDate.getDate()}`;
  }

  return routeDates;
};
const getRoute = (points) => {
  if (points.length === 0) {
    return ``;
  }
  const destinations = getDestinations(points);

  let route = ``;
  if (destinations.length > 3) {
    route = `${destinations[0]} — ... — ${destinations[destinations.length - 1]}`;
  } else {
    route = destinations.join(` — `);
  }

  return route;
};
const getTotalCost = (points) => {
  if (points.length === 0) {
    return 0;
  }
  return points
    .map((point) => point.totalPointPrice)
    .reduce((summ, current) => summ + current, 0);
};
const createTripInfoTemplate = (points) => {
  const route = getRoute(points);
  const dates = getRouteDates(points);
  const totalCost = getTotalCost(points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
    </section>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
