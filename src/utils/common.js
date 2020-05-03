export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};
export const formatDuration = (duration) => {
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
export const getDuration = (startDate, endDate) => {
  const duration = endDate.getTime() - startDate.getTime();

  return formatDuration(duration);
};
export const isDatesEqual = (firstDate, secondDate) => {
  return (firstDate.getYear() === secondDate.getYear())
    && (firstDate.getMonth() === secondDate.getMonth())
    && (firstDate.getDate() === secondDate.getDate());
};

export const capitalizeFirstLetter = (str) => {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};
