import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import { cloneDeep } from 'lodash';
import 'rc-slider/assets/index.css';
import style from './style.module.scss';

type RangeControlStateMemberType = {
  prefix?: string;
  value: number;
  suffix?: string;
};
type RangeControlStateType = [RangeControlStateMemberType, RangeControlStateMemberType];
type RangeControlStaticValuesType = {
  minMax: [number, number];
};
type RangeControlChangeEventType = {
  name: 'rangeControl';
  state: RangeControlStateType;
};
type RangeControlOnChangeType = (e: RangeControlChangeEventType) => void;

interface Props {
  state: RangeControlStateType;
  minMax: RangeControlStaticValuesType['minMax'];
  onChange: RangeControlOnChangeType;
}

const RangeControl = ({ minMax, state, onChange }: Props) => {
  //
  const [value, setValue] = useState(state.map((m, i) => m.value || minMax[i]));

  const handleChange = (e: number[]) => {
    setValue(e);
  };

  useEffect(() => {
    setValue(state.map((m, i) => m.value || minMax[i]));
  }, [state]);

  const handleAfterChange = (e: number[]) => {
    const stateValues = cloneDeep(e);
    const newState: RangeControlStateType = [
      { prefix: 'از', value: stateValues[0] },
      { prefix: 'تا', value: stateValues[1] },
    ];
    onChange({ name: 'rangeControl', state: newState });
  };

  return (
    <>
      <Slider
        range
        className={style['filter__price-slider']}
        // defaultValue={state.map((m, i) => m.value || minMax[i])}
        value={value}
        onChangeComplete={(e) => {
          handleAfterChange(e as number[]);
        }}
        onChange={(e) => {
          handleChange(e as number[]);
        }}
        min={minMax[0]}
        max={minMax[1]}
        // step={10}
        reverse={true}
        allowCross={false}
      />
      <div className={style['filter__price-sub']}>
        <span>
          {state[0].prefix || ''} {state[0].value.toLocaleString()} {state[0].suffix || ''}
        </span>
        <span>
          {state[1].prefix || ''} {state[1].value.toLocaleString()} {state[1].suffix || ''}
        </span>
      </div>
    </>
  );
};

export { RangeControl };
export type { RangeControlStateMemberType };
export type { RangeControlStateType };
export type { RangeControlStaticValuesType };
export type { RangeControlChangeEventType };
