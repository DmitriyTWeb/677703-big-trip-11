// import {FilterType} from "../../../677703-taskmanager-11/src/const";

export default class Points {
  constructor() {
    this._points = [];
    // this._activeFilterType = FilterType.All;

    this._dataChangeHandlers = [];
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = []
      .concat(this._points.slice(0, index), point, this._points.slice(index + 1));

    // pointController
    //   .render(this._points[index], this._destinations, this._typeOptions);
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
