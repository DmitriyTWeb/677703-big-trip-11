import AbstractComponent from "./abstract-component.js";

const createNodePointsTemplate = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>`
  );
};


export default class NoPoints extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createNodePointsTemplate();
  }
}
