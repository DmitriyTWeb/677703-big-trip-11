import AbstractComponent from "./abstract-component.js";

const createLoadingTemplate = () => {
  return (
    `<p class="trip-loading__msg">Loading...</p>`
  );
};


export default class Loading extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadingTemplate();
  }
}
