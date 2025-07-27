import cn from 'classnames';

import styles from './select.module.scss';
import SelectItems from './selectItems';

import { ArrowDownIcon } from 'assets/icons';
import { useEffect, useState } from 'react';
import { notify } from 'utils/notification';

type SelectLeader = {
  label: string;
  handleSelect: (val: { id?: string; title?: string }) => void;
  options?: { id?: string; title?: string }[];
};

const SelectLeader = ({ label, options, handleSelect }: SelectLeader) => {
  // const {
  //   formState: {errors},
  // } = useFormContext();
  const [selected, setSelected] = useState<{ id?: string; title?: string }>();

  useEffect(() => {
    selected && handleSelect(selected);
  }, [selected]);
  return (
    <div
      onClick={() => {
        options?.length === 0 &&
          notify({
            type: 'error',
            message: 'لطفا ابتدا مسافران خود را انتخاب کنید',
          });
      }}
      style={{ width: '100%' }}
      className={`mb-3`}
    >
      <div className={cn(styles['select'], styles['select--selected'])}>
        <select
          onChange={(e) => {
            setSelected(e.target.value as { id?: string; title?: string });
          }}
          className={cn(styles['select__selectTag'])}
        >
          <SelectItems label={label} options={options} selected={selected} />
        </select>
        {/* <label
          className={cn(
            styles['select__label'],
            selected ? styles['select__label--active'] : '',
          )}
        >
          {selected && label}
        </label> */}
        <div className={styles['select__suffix']}>
          <ArrowDownIcon />
        </div>
      </div>
    </div>
  );
};

export default SelectLeader;
