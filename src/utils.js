import {MONTHS} from "./const.js";

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};
const formatTimeToEditPoint = (timestamp) => {
  const date = castTimeFormat(timestamp.getDate());
  const month = castTimeFormat(timestamp.getMonth());
  const year = `${timestamp.getFullYear()}`.substring(2);
  const hours = castTimeFormat(timestamp.getHours());
  const minutes = castTimeFormat(timestamp.getMinutes());

  return `${date}/${month}/${year} ${hours}:${minutes}`;
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
const getRoute = (points) => {
  const sortedPoints = points
    .slice()
    .sort((first, second) => first.startDate - second.startDate);
  const shortPoints = sortedPoints.map((point) => point.destination);

  const full = shortPoints.join(` — `);
  let short = ``;
  if (shortPoints.length > 3) {
    short = `${shortPoints[0]} — ... — ${shortPoints[shortPoints.length - 1]}`;
  } else {
    short = `${shortPoints[0]} — ${shortPoints[1]} — ${shortPoints[2]}`;
  }

  const startDate = sortedPoints[0].startDate;
  const endDate = sortedPoints[sortedPoints.length - 1].endDate;
  let dates = ``;
  if (startDate.getMonth() === endDate.getMonth()) {
    dates = `${MONTHS[startDate.getMonth()].toUpperCase()} ${startDate.getDate()} — ${endDate.getDate()}`;
  } else {
    dates = `${MONTHS[startDate.getMonth()].toUpperCase()} ${startDate.getDate()} — ${MONTHS[endDate.getMonth()].toUpperCase()} ${endDate.getDate()}`;
  }

  return {short, full, dates};
};
const getTotalCost = (points) => {
  return points
    .map((point) => point.totalPointPrice)
    .reduce((summ, current) => summ + current, 0);
};
export {castTimeFormat, formatTime, getDuration, formatTimeToEditPoint, getRoute, getTotalCost};
