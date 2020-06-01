export default class Point {
  constructor(point) {
    this.id = point[`id`];
    this.type = point[`type`];
    this.destination = point[`destination`] || {};
    this.startDate = new Date(point[`date_from`]).getTime();
    this.endDate = new Date(point[`date_to`]).getTime();
    this.inputPrice = point[`base_price`];
    this.isFavorite = point[`is_favorite`];
    this.options = point[`offers`];
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": this.destination,
      "date_from": new Date(this.startDate).toISOString(),
      "date_to": new Date(this.endDate).toISOString(),
      "base_price": this.inputPrice,
      "is_favorite": this.isFavorite,
      "offers": this.options
    };
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }

  static clone(point) {
    return new Point(point.toRAW());
  }
}
