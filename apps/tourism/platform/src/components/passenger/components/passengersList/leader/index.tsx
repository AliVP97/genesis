import React, { useContext, useMemo } from 'react';
import { Controller } from 'react-hook-form';
// import Input from '../input';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { LeaderForm } from '..';
import SelectLeader from '../../addPassenger/selectLeader';
import styles from './selectLeader.module.scss';
import Input from '../input';
type Leader = {
  leaderForm: LeaderForm;
};
const Leader = (props: Leader) => {
  const { leaderForm } = props;
  const { selectedPassengers, setLeader, leader, disabledPassengers } =
    useContext<MoreButtonContext>(MoreButtonContext);
  const leaderOptions = useMemo(() => {
    const items = [];
    if (selectedPassengers) {
      for (const item of selectedPassengers) {
        if (
          item?.ageType === 'AGE_TYPE_ADULT' &&
          !disabledPassengers?.includes(item.id as string)
        ) {
          items.push({
            id: item.id,
            title: item.persianName
              ? item.persianName + ' ' + item.persianFamily
              : item.englishName
                ? item?.englishName + ' ' + item?.englishFamily
                : undefined,
          });
        }
      }
    }
    return items;
  }, [selectedPassengers]);
  return (
    <div className={styles['container']}>
      {' '}
      <SelectLeader
        label="انتخاب سرپرست"
        handleSelect={(item) => {
          if (setLeader && selectedPassengers) {
            const cloneLeader = leader || {};
            const passenger = selectedPassengers.find((pass) => {
              return item === pass.id;
            });

            leaderForm.setValue(leaderForm.id, passenger?.phoneNumber || '');

            setLeader({
              ...cloneLeader,
              selectedLeader: passenger,
            });
          }
        }}
        options={leaderOptions}
      />
      <Controller
        control={leaderForm.control}
        name={leaderForm.id}
        render={({ field }) => {
          return (
            <Input
              label={leaderForm.label}
              errors={leaderForm.errors}
              resetField={leaderForm.resetField}
              inputMode={'numeric'}
              field={field}
              handleChange={(val) => field.onChange(val)}
            />
          );
        }}
      />
    </div>
  );
};

export default Leader;
