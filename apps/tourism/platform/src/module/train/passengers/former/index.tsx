import styles from './formerPassengers.module.scss';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { PassengerPayload } from 'services/general/passenger/interface';
import { ChangeEvent, useState } from 'react';
import PassengersItem from 'module/train/passenger/passengersItem';
import Button from 'components/button';
import { SearchIcon } from 'assets/icons';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  passengers: PassengerPayload['body'][] | undefined;
  selectPassenger?: (passenger: PassengerPayload['body']) => void;
  selected?: PassengerPayload['body'][];
}

const FormerPassengers = ({ open, setOpen, passengers, selectPassenger, selected }: Props) => {
  const { uuidExpired } = useSelector((state: RootState) => state.expireTimeSlice);
  const [result, setResult] = useState<PassengerPayload['body'][] | undefined>(passengers);
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
                  key={item.id}
                  passenger={item}
                  selectPassenger={selectPassenger}
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
