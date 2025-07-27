import { cloneDeep } from 'lodash';
import cn from 'classnames';

import { CloseCircleWhiteIcon } from 'assets/icons';
import {
  TicketsFilterComponentStateType,
  TicketsFilterPairSelectComponentStateType,
  TicketsFilterMultipleSelectComponentStateType,
  TicketsFilterStateMemberType,
  TicketsFilterPropsType,
} from 'containers/ticketsFilter/types';
import { RangeControlStateMemberType } from 'components/rangeControl';
import useDeviceDetect from '../../utils/hooks/useDeviceDetect';

import style from './style.module.scss';

const TicketsFilterChips = ({ state, onChange, length }: TicketsFilterPropsType) => {
  const handleChange = ({
    componentId,
    componentState,
  }: {
    componentId: string;
    componentState: TicketsFilterComponentStateType;
  }) => {
    const newState = cloneDeep(state);
    const newMemberIndex = newState.indexOf(
      newState.find((m) => m.id === componentId) as TicketsFilterStateMemberType,
    );
    newState[newMemberIndex].component.state = componentState;
    onChange({ name: 'ticketsFilter', state: newState });
  };
  const { isMobile } = useDeviceDetect();
  return (
    <div className={cn(style.chips, !isMobile && 'flex-column')}>
      {state.map((S, index) => {
        let chips;
        switch (S.component.name) {
          case 'rangeControl':
            chips = (
              <section key={S.id + index.toString()}>
                {
                  // show range chips if at least one of range values has changed:
                  !!S.component.staticValues?.minMax.reduce((prev, curr, i) => {
                    if (curr !== S.component.state[i].value) prev++;
                    return prev;
                  }, 0) &&
                    S.component.state.map((s, i, sss) => (
                      <div className={style.chip} key={i}>
                        <span className={style.title}>
                          {S.title} {(s as RangeControlStateMemberType).prefix} {s.value}{' '}
                          {(s as RangeControlStateMemberType).suffix}
                        </span>
                        <span
                          className={style['close-button']}
                          onClick={() => {
                            handleChange({
                              componentId: S.id,
                              componentState: sss.map((m, j) => ({
                                ...m,
                                value: S.component.staticValues?.minMax[j],
                              })) as TicketsFilterPairSelectComponentStateType,
                            });
                          }}
                        >
                          <CloseCircleWhiteIcon />
                        </span>
                      </div>
                    ))
                }
              </section>
            );
            break;
          case 'multiSelectButtons':
          case 'companiesList':
            chips = (S.component.state as TicketsFilterMultipleSelectComponentStateType)?.map(
              (s, i, sss) =>
                s.isSelected && (
                  <div className={style.chip} key={i}>
                    <span className={style.title}>{S.title + ' ' + s.title}</span>
                    <span
                      className={style['close-button']}
                      onClick={() => {
                        handleChange({
                          componentId: S.id,
                          componentState: sss.map((m) => {
                            let newM = m;
                            if (m.value === s.value) newM = { ...newM, isSelected: false };
                            return newM;
                          }),
                        });
                      }}
                    >
                      <CloseCircleWhiteIcon />
                    </span>
                  </div>
                ),
            );
        }
        return chips;
      })}
      {length ? (
        <div className="d-flex d-inline-block ">
          <span>{`${length}`}</span>
          <span className="pe-1">نتیجه یافت شد</span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export { TicketsFilterChips };
