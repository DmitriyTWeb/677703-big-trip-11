import {MONTHS} from "../const.js";
import {castTimeFormat} from "../utils.js";
import {createPointTemplate} from "./point.js";

const createDayContainerTemplate = (points, date, dayNumber) => {
  const month = MONTHS[date.getMonth()];
  const pointsTemplate = points.map((point) => createPointTemplate(point)).join(`\n`);

  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="${date.toISOString()}">${month} ${castTimeFormat(date.getDate())}</time>
      </div>

      <ul class="trip-events__list">
        ${pointsTemplate}
      </ul>
    </li>
  `;
};

export const createEventsTemplate = (points) => {
  let groupCurrentDay = points[0].startDate;
  let pointsGroup = [];
  let counter = 1;
  let daysTemplateArr = [];
  points.forEach((point) => {
    if (point.startDate.getMonth() === groupCurrentDay.getMonth()
        && point.startDate.getDate() === groupCurrentDay.getDate()) {
      pointsGroup.push(point);
    } else {
      daysTemplateArr.push(createDayContainerTemplate(pointsGroup, groupCurrentDay, counter));
      groupCurrentDay = point.startDate;
      pointsGroup = [];
      pointsGroup.push(point);
      counter++;
    }
  });
  return daysTemplateArr.join(`\n`);
};

