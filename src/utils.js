const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDuration = (duration) => {
  const oneDayMS = 1000 * 60 * 60 * 24;
  const oneHourMS = 1000 * 60 * 60;
  const oneMinuteMS = 1000 * 60;

  if (duration < 0) {
    return `--D --H --M`;
  }

  let days = `${castTimeFormat(Math.floor(duration / oneDayMS))}D`;
  let hours = `${castTimeFormat(Math.floor(duration % oneDayMS / oneHourMS))}H `;
  let minutes = `${castTimeFormat(Math.floor(duration % oneHourMS / oneMinuteMS))}M`;

  days = days === `00D` ? `` : `${days} `;

  if (days === ``) {
    hours = hours === `00H ` ? `` : `${hours}`;
  }

  return `${days}${hours}${minutes}`;
};
const getDuration = (startDate, endDate) => {
  const duration = endDate.getTime() - startDate.getTime();

  return formatDuration(duration);
};
const isDatesEqual = (firstDate, secondDate) => {
  return (firstDate.getYear() === secondDate.getYear())
    && (firstDate.getMonth() === secondDate.getMonth())
    && (firstDate.getDate() === secondDate.getDate());
};
const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
  }
};

export {
  castTimeFormat,
  formatTime,
  getDuration,
  isDatesEqual,
  RenderPosition,
  createElement,
  render
};
