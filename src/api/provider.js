export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getPoints() {
    return this._api.getPoints();
  }

  getDesinations() {
    return this._api.getDesinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  createPoint(point) {
    return this._api.createPoint(point);
  }

  updatePoint(id, point) {
    return this._api.updatePoint(id, point);
  }

  deletePoint(id) {
    return this._api.deletePoint(id);
  }
}
