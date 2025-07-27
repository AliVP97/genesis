import { useAppSelector } from 'store/hook/storeHook';
import { selectRefundItineraryPassengers } from 'store/slices/internationalFlight/selectors/refund';
import Card from './Card';
import { UserIcon } from 'assets/icons';
import { useMemo } from 'react';
import { Passenger } from '../types/api';
import MultiSelectItem from './MultiSelectItem';
import styles from './PassengersMultiSelect.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

const getLabel = (passenger: Passenger) =>
  [passenger.firstName, passenger.lastName].map((name) => name?.english ?? '').join(' ');

type PassengersMultiSelectProps = {
  value: number[];
  onChange: (index: number) => (checked: boolean) => void;
};

type MultiSelectListProps = {
  data: {
    label: string;
    disabled: boolean;
    statusColor: string;
    statusText: string;
  }[];
  value: number[];
  onChange: (index: number) => (checked: boolean) => void;
};

const MultiSelectList = ({ value, data, onChange }: MultiSelectListProps) => (
  <>
    {data.map(({ label, disabled, statusColor, statusText }, index) => (
      <MultiSelectItem
        key={index}
        label={label}
        disabled={disabled}
        statusText={statusText}
        id={`passenger-${index}`}
        statusColor={statusColor}
        onChange={onChange(index)}
        checked={disabled ? true : value.includes(index)}
      />
    ))}
  </>
);

const PassengersMultiSelect = ({ value, onChange }: PassengersMultiSelectProps) => {
  const { isMobile } = useDeviceDetect();
  const passengers = useAppSelector(selectRefundItineraryPassengers);
  const extraInfo = `${passengers.length} مسافر`;
  const data = useMemo(
    () =>
      passengers.map((passenger) => ({
        label: getLabel(passenger),
        statusText: passenger.passengerStatus?.reason ?? '',
        statusColor: passenger.passengerStatus?.color ?? '#000',
        disabled: !passenger.passengerStatus?.availableForRefund,
      })),
    [passengers],
  );

  return (
    <>
      {isMobile && (
        <Card title={'مسافران'} avatar={<UserIcon />} extraInfo={extraInfo} className={styles.card}>
          <MultiSelectList data={data} value={value} onChange={onChange} />
        </Card>
      )}
      {!isMobile && (
        <div>
          <div className={styles['desktop-card-header']}>
            <UserIcon />
            <span>مسافران</span>
          </div>
          <div className={styles['desktop-card-content']}>
            <MultiSelectList data={data} value={value} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
};

export default PassengersMultiSelect;
