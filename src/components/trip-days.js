import AbstractComponent from "./abstract-component.js";

const createTripDaysTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripDays extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripDaysTemplate();
  }
}
