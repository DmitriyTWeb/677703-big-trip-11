export default class Destination {
  constructor(destination) {
    this.description = destination[`description`];
    this.name = destination[`name`];
    this.pictures = destination[`pictures`];
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destination) {
    return destination.map(Destination.parseDestination);
  }
}
