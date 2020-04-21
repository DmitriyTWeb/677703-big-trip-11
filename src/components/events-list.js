import AbstractComponent from "./abstract-component.js";

const createEventsListTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <!-- Сортировка -->

      <!-- Контент -->
    </section>`
  );
};

export default class EventsList extends AbstractComponent {
  getTemplate() {
    return createEventsListTemplate();
  }
}
