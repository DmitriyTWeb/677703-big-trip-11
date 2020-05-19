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

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
