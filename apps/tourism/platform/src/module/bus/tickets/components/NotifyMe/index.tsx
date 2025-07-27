import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { Switch } from 'components/switchButton/v2';
import { queryToState } from 'module/bus/search/utils';
import { busSearchQuerySchema } from 'module/bus/search/constants';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { useAlert } from 'services/bus/alert/useAlert';
import { TGetAlertPayload } from 'services/bus/alert/types';

import styles from './style.module.scss';

export const NotifyMe = () => {
  const { query } = useRouter();
  const [payload, setPayload] = useState<TGetAlertPayload>();

  const { login, setLoginModalVisible } = useAuthContext();

  const { data, setAlert, isLoading } = useAlert(payload);

  useEffect(() => {
    if (query) {
      queryToState(busSearchQuerySchema.parse(query)).then(
        ({ origin, destination, departureDate }) => {
          setPayload({
            originCode: origin.stationCode,
            destinationCode: destination.stationCode,
            departureDate: String(
              new Date(dayjs(departureDate, { jalali: true }).format('YYYY-MM-DD')).valueOf() /
                1000,
            ),
          });
        },
      );
    }
  }, [query]);

  const onChange = (checked: boolean) => {
    if (login) {
      setAlert({ id: data?.id, isActive: checked });
    } else {
      setLoginModalVisible(true);
    }
  };

  return data?.isModuleAvailable ? (
    <div className={styles['notify-me']}>
      <div>
        <div className={styles['primary-text']}>موجود شد، خبرم کن!</div>
        <div className={styles['secondary-text']}>اطلاع رسانی از طریق پیامک انجام می‌شود.</div>
      </div>
      <Switch checked={data?.isActive} onChange={onChange} loading={isLoading} />
    </div>
  ) : (
    <></>
  );
};
