import {activityCategory} from "../const.js";
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

  if (days === `` && hours === `` && minutes === ``) {
    return `00D 00H 00M`;
  }
  if (days) {
    return `${days} ${hours ? hours : `00H`} ${minutes ? minutes : `00M`}`;
  } else if (hours) {
    return `${hours} ${minutes ? minutes : `00M`}`;
  }

  return `${minutes}`;
};
export const getPointCategory = (pointType) => {
  return activityCategory.some((it) => it === pointType) ? `activity` : `transfer`;
};
export const isDatesEqual = (firstDate, secondDate) => {
  firstDate = new Date(firstDate);
  secondDate = new Date(secondDate);
  return (firstDate.getYear() === secondDate.getYear())
    && (firstDate.getMonth() === secondDate.getMonth())
    && (firstDate.getDate() === secondDate.getDate());
};

export const capitalizeFirstLetter = (str) => {
  if (str.length === 0) {
    return ``;
  }
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const getTypeOptions = (allTypesOptions, type) => {
  const typeOptions = allTypesOptions.find((item) => item.type === type);
  return typeOptions ? typeOptions.options : [];
};
