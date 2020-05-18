export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`] || {};
    this.startDate = new Date(data[`date_from`]).getTime();
    this.endDate = new Date(data[`date_to`]).getTime();
    this.inputPrice = data[`base_price`];
    this.isFavorite = data[`is_favorite`];
    this.options = data[`offers`];
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }
}
