import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {activityCategoryTypes} from "../const.js";
import moment from "moment";

const BAR_HEIGHT = 55;
const DATALABELS_FONTSIZE = 13;
const CHART_TITLE_FONTSIZE = 23;
const TICKS_FONTSIZE = 13;
const TICKS_PADDING = 5;
const BAR_THICKNESS = 44;
const MIN_BAR_LENGTH = 50;

const TypeEmoji = {
  BUS: `🚌`,
  CHECK_IN: `🏨`,
  DRIVE: `🚗`,
  FLIGHT: `✈️`,
  RESTAURANT: `🍽️`,
  SHIP: `🚢`,
  SIGHTSEEING: `🏛️`,
  TAXI: `🚕`,
  TRAIN: `🚂`,
  TRANSPORT: `🚆`,
};

const ChartType = {
  HORIZAONTAL_BAR: `horizontalBar`,
};
const AnchorPosition = {
  START: `start`,
  END: `end`,
};
const AlignPosition = {
  START: `start`,
  END: `end`,
};
const Position = {
  LEFT: `left`,
};
const Color = {
  WHITE: `#ffffff`,
  BLACK: `#000000`,
};
const ChartTitle = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

const getEmojiByType = (type) => {
  const emojiTypeName = type.toUpperCase().replace(`-`, `_`);
  return TypeEmoji[emojiTypeName];
};
const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const getPointsByDateRange = (points, dateFrom, dateTo) => {
  return points.filter((point) => {
    const startDate = point.startDate;

    return startDate >= dateFrom.getTime() && startDate <= dateTo.getTime();
  });
};

const calculateTransportTypeNumbers = (points) => {
  const typeCount = {};

  points.forEach((point) => {
    if (!activityCategoryTypes.find((actitvityType) => actitvityType === point.type)) {
      if (!typeCount.hasOwnProperty(point.type)) {
        typeCount[`${point.type}`] = 1;
      } else {
        typeCount[`${point.type}`] += 1;
      }
    }
  });

  return typeCount;
};

const calculateTypeCost = (type, points) => {
  const typePoints = points.filter((point) => point.type === type);

  return typePoints.reduce((acc, item) => acc + item.inputPrice, 0);
};

const getDuration = (startTime, endTime) => {
  const start = moment(startTime);
  const end = moment(endTime);

  return moment.duration(end.diff(start));
};

const renderMoneyChart = (moneyCtx, points) => {
  const types = points.map((point) => point.type)
      .filter(getUniqItems);
  const typesCost = types.map((type) => calculateTypeCost(type, points));
  const typesCostLabels = types.map((type) => `${getEmojiByType(type)} ${type.toUpperCase()}`);

  moneyCtx.height = BAR_HEIGHT * types.length;
  if (typesCost.length === 1) {
    moneyCtx.height = BAR_HEIGHT * 2;
  }

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: ChartType.HORIZAONTAL_BAR,
    data: {
      labels: typesCostLabels,
      datasets: [{
        data: typesCost,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: AnchorPosition.start
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: DATALABELS_FONTSIZE
          },
          color: Color.BLACK,
          anchor: AnchorPosition.END,
          align: AlignPosition.START,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: ChartTitle.MONEY,
        fontColor: Color.BLACK,
        fontSize: CHART_TITLE_FONTSIZE,
        position: Position.LEFT
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: TICKS_PADDING,
            fontSize: TICKS_FONTSIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {
  const typeCount = calculateTransportTypeNumbers(points);

  const transportLabels = Object.keys(typeCount)
    .map((type) => `${getEmojiByType(type)} ${type.toUpperCase()}`);

  const transportData = Object.values(typeCount);
  transportCtx.height = BAR_HEIGHT * transportLabels.length;
  if (transportData.length === 1) {
    transportCtx.height = BAR_HEIGHT * 2;
  }

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: ChartType.HORIZAONTAL_BAR,
    data: {
      labels: transportLabels,
      datasets: [{
        data: transportData,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: AnchorPosition.START
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: DATALABELS_FONTSIZE
          },
          color: Color.BLACK,
          anchor: AnchorPosition.END,
          align: AlignPosition.START,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: ChartTitle.TRANSPORT,
        fontColor: Color.BLACK,
        fontSize: CHART_TITLE_FONTSIZE,
        position: Position.LEFT
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: TICKS_PADDING,
            fontSize: TICKS_FONTSIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (timeCtx, points) => {
  const typeTimes = {};

  points.forEach((point) => {
    if (!typeTimes.hasOwnProperty(point.type)) {
      typeTimes[`${point.type}`] = getDuration(point.startDate, point.endDate);
    } else {
      typeTimes[`${point.type}`] = typeTimes[`${point.type}`].add(getDuration(point.startDate, point.endDate));
    }
  });

  const timeLabels = Object.keys(typeTimes)
    .map((type) => `${getEmojiByType(type)} ${type.toUpperCase()}`);
  const timeData = Object.values(typeTimes).map((item) => Math.round(item.asHours()));
  timeCtx.height = BAR_HEIGHT * timeLabels.length;
  if (timeData.length === 1) {
    timeCtx.height = BAR_HEIGHT * 2;
  }

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: timeLabels,
      datasets: [{
        data: timeData,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: DATALABELS_FONTSIZE
          },
          color: Color.BLACK,
          anchor: AnchorPosition.END,
          align: AlignPosition.START,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: ChartTitle.TIME_SPENT,
        fontColor: Color.BLACK,
        fontSize: CHART_TITLE_FONTSIZE,
        position: Position.LEFT
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: TICKS_PADDING,
            fontSize: TICKS_FONTSIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: MIN_BAR_LENGTH
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  recoveryListener() {}

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  show() {
    super.show();
    this.rerender();
  }

  _renderCharts() {
    const points = this._pointsModel.getPointsAll();
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    // устанавливаем интервал по всему временному диапозону времени
    this._dateFrom = new Date(Math.min(...points.map((point) => point.startDate)));
    this._dateTo = new Date(Math.max(...points.map((point) => point.endDate)));

    this._resetCharts();
    const pointsInDateRange = getPointsByDateRange(points, this._dateFrom, this._dateTo);
    this._moneyChart = renderMoneyChart(moneyCtx, pointsInDateRange);
    this._transportChart = renderTransportChart(transportCtx, pointsInDateRange);
    this._timeChart = renderTimeChart(timeCtx, pointsInDateRange);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
