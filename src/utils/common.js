import moment from "moment";

const leadingZero = (value) => {
  return (value < 10 && value !== 0) ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`MMM DD`);
};

export const getDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  const duration = moment.duration(end.diff(start));

  let days = duration.days();
  let hours = duration.hours();
  let minutes = duration.minutes();

  days = days ? `${leadingZero(days)}D ` : ``;
  hours = hours ? `${leadingZero(hours)}H ` : ``;
  minutes = minutes ? `${leadingZero(minutes)}M` : ``;


  return `${days}${hours}${minutes}`;
};

export const isDatesEqual = (firstDate, secondDate) => {
  return (firstDate.getYear() === secondDate.getYear())
    && (firstDate.getMonth() === secondDate.getMonth())
    && (firstDate.getDate() === secondDate.getDate());
};

export const capitalizeFirstLetter = (str) => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};
