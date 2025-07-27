import { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BottomSheet } from 'react-spring-bottom-sheet';

import PassengersItem from 'module/flights/passenger/passengersItem';
import Button from 'components/button';

import { TPassengerType, TPassengerV2 } from 'services/general/passenger/interface';
import { SearchIcon } from 'assets/icons';

import styles from './formerPassengers.module.scss';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  passengers: TPassengerType[] | undefined;
  selectPassenger?: (passenger: TPassengerType) => void;
  selected?: TPassengerType[];
}

const FormerPassengers = ({ open, setOpen, passengers, selectPassenger, selected }: Props) => {
  const { uuidExpired } = useSelector((state: RootState) => state.expireTimeSlice);
  const [result, setResult] = useState<TPassengerType[] | undefined>(passengers);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const result = passengers?.filter((item) => {
      if (
        item.persianName?.includes(value) ||
        item.persianFamily?.includes(value) ||
        item.englishName?.toLowerCase().includes(value.toLowerCase()) ||
        item.englishFamily?.toLowerCase().includes(value.toLowerCase())
      )
        return item;
    });
    setResult(result);
  };
  return (
    <BottomSheet
      blocking={!uuidExpired}
      snapPoints={({ maxHeight }) => maxHeight * 0.8}
      open={open}
      onDismiss={() => setOpen(false)}
      header={
        <div className={styles['former-passengers__input--wrapper']}>
          <input placeholder="جستجوی مسافران" onChange={handleSearch} />
          <SearchIcon />
        </div>
      }
    >
      <div className={styles['former-passengers']}>
        <div className={styles['former-passengers__wrapper']}>
          {result?.length
            ? result.map((item) => (
                <PassengersItem
                  editable={false}
                  key={item.id?.toString() + 'former'}
                  passenger={item}
                  selectPassenger={selectPassenger as (passenger: TPassengerV2) => void}
                  checked={selected?.includes(item)}
                />
              ))
            : null}
        </div>
        <div className={styles['former-passengers__submit']}>
          <Button btnType="submit" radius onClick={() => setOpen(false)}>
            انتخاب
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

export default FormerPassengers;
