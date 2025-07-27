import { cloneDeep } from 'lodash';
import cn from 'classnames';

import { RangeControl, RangeControlStateType } from 'components/rangeControl';
import { MultiSelectButtons } from 'components/multiSelectButtons';
import { MultiSelectButtonsStateType } from 'components/multiSelectButtons/types';
import { CompaniesList } from 'containers/companiesList';
import { CompaniesListStateType } from 'containers/companiesList/types';
import {
  TicketsFilterPropsType,
  TicketsFilterComponentChangeEventType,
  TicketsFilterStateMemberType,
} from './types';

import style from './style.module.scss';

const TicketsFilter = ({ state, onChange }: TicketsFilterPropsType) => {
  const handleChange = ({
    componentId,
    data,
  }: {
    componentId: string;
    data: TicketsFilterComponentChangeEventType;
  }) => {
    const newState = cloneDeep(state);
    const newStateNewMemberIndex = newState.indexOf(
      newState.find((m) => m.id === componentId) as TicketsFilterStateMemberType,
    );

    newState[newStateNewMemberIndex].component.state = data.state;
    onChange({ name: 'ticketsFilter', state: newState });
  };

  return (
    <div className={style.filter}>
      {state.map((stateMember, index) => {
        let filterSection;
        switch (stateMember.component.name) {
          case 'rangeControl':
            filterSection = (
              <section
                key={stateMember.id + index.toString()}
                title={stateMember.id}
                className={`${cn(style.filter__price, 'mx-2')} ${style['filter-section']}`}
              >
                <span className={style.filter__title}>{stateMember.title}</span>
                <RangeControl
                  minMax={stateMember.component.staticValues!.minMax}
                  state={stateMember.component.state as RangeControlStateType}
                  onChange={(e) => {
                    handleChange({ componentId: stateMember.id, data: e });
                  }}
                />
              </section>
            );
            break;
          case 'multiSelectButtons':
            if (stateMember.component.state.length) {
              filterSection = (
                <section
                  key={stateMember.id + index.toString()}
                  title={stateMember.id}
                  className={style['filter-section']}
                >
                  <span className={style.filter__subTitle}>{stateMember.title}</span>
                  <div className={style.filter__section}>
                    <MultiSelectButtons
                      state={stateMember.component.state as MultiSelectButtonsStateType}
                      onChange={(e) => {
                        handleChange({ componentId: stateMember.id, data: e });
                      }}
                    />
                  </div>
                </section>
              );
            }
            break;
          case 'companiesList':
            filterSection = (
              <section className={style['filter-section']} key={stateMember.id + index.toString()}>
                <CompaniesList
                  title={stateMember.title}
                  state={stateMember.component.state as CompaniesListStateType}
                  onChange={(e) => {
                    handleChange({ componentId: stateMember.id, data: e });
                  }}
                  showTotal={stateMember.component.showTotal}
                  showDropdown={stateMember.component.showDropdown}
                />
              </section>
            );
            break;
        }
        return filterSection;
      })}
    </div>
  );
};

export { TicketsFilter };
