
import AbstractComponent from "./abstract-component.js";
import moment from "moment";

const sortPoints = (points) => {
  // сортирует точки по дате от меньшей к большей
  return points
    .slice()
    .sort((first, second) => first.startDate - second.startDate);
};
const getDestinations = (points) => {
  const sortedPoints = sortPoints(points);
  return sortedPoints.map((point) => point.destination.name);
};
const getRouteDates = (points) => {
  if (points.length === 0) {
    return ``;
  }
  const sortedPoints = sortPoints(points);

  const startDate = new Date(sortedPoints[0].startDate);
  const endDate = new Date(sortedPoints[sortedPoints.length - 1].endDate);
  let routeDates = ``;

  if (startDate.getDate() === endDate.getDate()) {
    routeDates = `${moment(startDate).format(`MMM DD`)}`;
  } else {
    routeDates = `${moment(startDate).format(`MMM DD `)} — ${moment(endDate).format(`MMM DD`)}`;
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

const getPointCost = (point) => {
  const optionsCost = point.options.reduce((acc, current) => {
    return acc + current.price;
  }, 0);
  return point.inputPrice + optionsCost;
};

const getTotalCost = (points) => {
  if (points.length === 0) {
    return 0;
  }

  return points.map((point) => getPointCost(point))
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
