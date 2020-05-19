import Point from "./models/point.js";
import Destination from "./models/destination.js";
import Offer from "./models/offer.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  updatePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      body: JSON.stringify(data),
      headers,
    })
      .then((response) => response.json())
      .then(Point.parseTasks);
  }

  getDesinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
      .then((response) => response.json())
      .then(Destination.parsePoints);
  }

  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, { headers })
      .then((response) => response.json())
      .then(Offer.parseOffers);
  }
};

export default API;
