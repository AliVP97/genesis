import { cloneDeep } from 'lodash';

import { QueryType } from 'utils/helpers/global';
import {
  TicketsFilterStateType,
  TicketsFilterPairSelectComponentStateType,
  TicketsFilterMultipleSelectComponentStateType,
  TicketsFilterComponentStateType,
} from 'containers/ticketsFilter/types';
import { MultiSelectButtonsStateType } from 'components/multiSelectButtons/types';
import { CompaniesListStateType } from 'containers/companiesList/types';

/** Returns a new state based on the given query & state. */
export const createTicketsFilterState = (QUERY: QueryType, STATE: TicketsFilterStateType) => {
  return cloneDeep(STATE).map((S) => {
    const query = QUERY[S.id];
    if (query) {
      switch (S.component.name) {
        case 'rangeControl':
          S.component.state = query.split(',').map((q, i) => {
            return { ...S.component.state[i], value: +q };
          }) as TicketsFilterPairSelectComponentStateType;

          break;
        case 'multiSelectButtons':
        case 'companiesList':
          S.component.state = (
            S.component.state as TicketsFilterMultipleSelectComponentStateType
          ).map((s) => {
            let isSelected = false;
            if (query.split(',').includes(s.value)) {
              isSelected = true;
            }
            return { ...s, isSelected };
          });
      }
    }
    return S;
  });
};

type RangeValue = [min: number, max: number];

const isSameRangeValues = (defaultValue: RangeValue, value: RangeValue) =>
  value[0] === defaultValue[0] && value[1] === defaultValue[1];

const toRangeValue = (value: TicketsFilterComponentStateType): RangeValue =>
  value.map((m) => m.value) as RangeValue;

/**
 * - Converts the state to query object.
 * - Excludes "id".
 */
export const ticketsFilterStateToQuery = (state: TicketsFilterStateType) => {
  const query: QueryType = {};
  state.forEach(({ id, component }) => {
    const minMax = component.staticValues?.minMax;

    if (minMax && isSameRangeValues(minMax, toRangeValue(component.state))) {
      query[id] = undefined;
      return;
    }

    if (id !== 'id' && component.state?.length) {
      let propertyValue = '';
      switch (component.name) {
        case 'rangeControl':
          propertyValue = component.state.map((m) => m.value).join(',');
          break;
        case 'multiSelectButtons':
        case 'companiesList':
          propertyValue = (component.state as { value: string; isSelected: boolean }[])
            .reduce((prev: string[], curr) => {
              if (curr.isSelected) {
                prev.push(curr?.value?.replace(/ /g, '+'));
              }
              return prev;
            }, [])
            .join(',');
      }
      query[id] = propertyValue ? propertyValue : undefined;
    }
  });
  return query;
};

export const totalSelectedFilters = (filterState: TicketsFilterStateType) => {
  let total = 0;
  filterState.forEach((filter) => {
    switch (filter.component.name) {
      case 'rangeControl':
        filter.component.state.forEach((item, index) => {
          if (item.value !== filter.component.staticValues?.minMax[index]) {
            total += 1;
          }
        });
        break;
      case 'multiSelectButtons':
      case 'companiesList':
        (filter.component.state as MultiSelectButtonsStateType | CompaniesListStateType).forEach(
          (item) => {
            total += +item.isSelected;
          },
        );
    }
  });
  return total;
};
