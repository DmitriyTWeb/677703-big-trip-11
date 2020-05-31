import {FilterType} from "../const.js";

const getPastPoints = (points, nowDate) => {
  return points
      .filter((point) => point.endDate < nowDate);
};

const getFuturePoint = (points, nowDate) => {
  return points
    .filter((point) => point.startDate > nowDate);
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date().getTime();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE:
      return getFuturePoint(points, nowDate);
  }

  return points ? points : [];
};
