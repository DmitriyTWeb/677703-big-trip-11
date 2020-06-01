import Point from "../models/point.js";
// import Destination from "../models/destination.js";
// import Offer from "../models/offer.js";

import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));
          this._store.setPoints(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getPoints());
    if (storePoints && storePoints.length !== 0) {
      return Promise.resolve(Point.parsePoints(storePoints));
    }

    return Promise.resolve([]);
  }

  getDesinations() {
    if (isOnline()) {
      return this._api.getDesinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);

          return destinations;
        });
    }
    const storeDestinations = Object.values(this._store.getDestinations());

    if (storeDestinations && storeDestinations.length !== 0) {
      return Promise.resolve(storeDestinations);
    }

    return Promise.reject(`Check your internet connection. It seems this is first start of App.`);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);

          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getOffers());
    if (storeOffers && storeOffers.length !== 0) {
      return Promise.resolve(storeOffers);
    }

    return Promise.reject(`Check your internet connection. It seems this is first start of App.`);
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._store.setPoint(localNewPoint.id, localNewPoint.toRAW());

    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(point, {id}));
    this._store.setPoint(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removePoint(id));
    }

    this._store.removePoint(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = response.created;
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setPoints(items);
          return Object.values(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
