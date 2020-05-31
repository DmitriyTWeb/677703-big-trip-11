import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {getPointsByFilter} from "../utils/filter.js";
import {render, replace, RenderPosition} from "../utils/render.js";


const checkFiltersRelevance = (points) => {
  const everythingPoints = points;
  const pastPoints = getPointsByFilter(points, FilterType.PAST);
  const ruturePoints = getPointsByFilter(points, FilterType.FUTURE);

  return {
    everything: everythingPoints.length !== 0 ? true : false,
    past: pastPoints.length !== 0 ? true : false,
    future: ruturePoints.length !== 0 ? true : false,
  };
};

export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this.resetFilter = this.resetFilter.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const relevantFilter = checkFiltersRelevance(this._pointsModel.getPointsAll());
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters, relevantFilter);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTER);
    }
  }

  resetFilter() {
    this._filterComponent.resetFilter();
  }

  _filterChangeHandler(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
