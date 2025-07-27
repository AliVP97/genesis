import classNames from 'classnames';
import RadioElement from 'components/radio';
import { FlightType } from 'module/flights/tickets/ticket/searchTicket';
import { FC } from 'react';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import styles from './ticketType.module.scss';

interface Props {
  type: FlightType;
  onChange: (type: FlightType) => void;
}

const TicketType: FC<Props> = ({ type, onChange }) => {
  const { isMobile } = useDeviceDetect();

  return (
    <>
      {isMobile && (
        <div className={classNames(styles['ticket-type'])}>
          <div
            onClick={() => onChange('roundTrip')}
            className={classNames(
              styles['ticket-type__button'],
              type === 'roundTrip' && styles['ticket-type__button--active'],
            )}
          >
            رفت و برگشت
          </div>
          <div
            onClick={() => onChange('oneWay')}
            className={classNames(
              styles['ticket-type__button'],
              type === 'oneWay' && styles['ticket-type__button--active'],
            )}
          >
            یک طرفه
          </div>
        </div>
      )}
      {!isMobile && isMobile !== undefined && (
        <div className="d-flex flex-row-reverse">
          <div className="hover" role={'button'}>
            <RadioElement
              className="rtl color-on-surface"
              checked={type === 'oneWay'}
              label="یک‌طرفه"
              onChange={() => onChange('oneWay')}
              value="oneWay"
            />
          </div>
          <div className="px-4 hover" role={'button'}>
            <RadioElement
              className="rtl color-on-surface"
              checked={type === 'roundTrip'}
              label="رفت و برگشت"
              onChange={() => onChange('roundTrip')}
              value="roundTrip"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TicketType;
