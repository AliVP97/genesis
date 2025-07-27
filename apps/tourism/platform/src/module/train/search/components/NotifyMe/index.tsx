import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { useAlert } from 'services/train/alert/useAlert';
import { queryToState } from 'module/train/utils';
import { TGetAlertPayload } from 'services/train/alert/types';
import { Switch } from 'components/switchButton/v2';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { trainSearchUrlSchema } from '../../utils';

import styles from './style.module.scss';

export const NotifyMe = () => {
  const { query } = useRouter();
  const [payload, setPayload] = useState<TGetAlertPayload>();

  const { login, setLoginModalVisible } = useAuthContext();

  const { data, setAlert, isLoading } = useAlert(payload);

  useEffect(() => {
    if (query) {
      queryToState(trainSearchUrlSchema.parse(query)).then(
        ({ origin, destination, departureDate }) => {
          setPayload({
            originCode: origin.code,
            destinationCode: destination.code,
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
