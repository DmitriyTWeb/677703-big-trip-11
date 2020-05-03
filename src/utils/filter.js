import {FilterType} from "../const.js";

const getPastPoints = (points, nowDate) => {
  return points
      .filter((point) => point.endDate.getTime() < nowDate.getTime());
};

const getFuturePoint = (points, nowDate) => {
  return points
    .filter((point) => point.startDate.getTime() > nowDate.getTime());
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE:
      return getFuturePoint(points, nowDate);
  }

  return points;
};
