const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  getDesinations() {
    if (isOnline()) {
      return this._api.getDesinations();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }
}
