import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import jmoment from 'moment-jalaali';

import { DomesticFlightReminderMockPhone } from 'assets/images';
import SwitchButton from 'components/switchButton';
import { getFlightAlert, updateFlightAlert } from 'services/domestic/flight';
import { TFlightAlertsResponse } from 'services/domestic/flight/interface';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import SubmitModal from './SubmitModal';
import styles from './style.module.scss';
import Button from 'components/button';

export const toastOptions = {
  autoClose: 5000,
  closeButton: false,
  rtl: true,
  pauseOnFocusLoss: false,
  draggable: true,
  hideProgressBar: true,
  position: toast.POSITION.TOP_RIGHT,
  className: 'notification',
};

type LetMeKnowProps = {
  returning?: boolean;
};

export const LetMeKnow: FC<LetMeKnowProps> = ({ returning = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<TFlightAlertsResponse>();

  const { login, setLoginModalVisible } = useAuthContext();
  const { query } = useRouter();

  const fetchData = () => {
    let [originIATA, destinationIATA] = (query?.id as string)?.split('-');
    let departureDate = jmoment(query?.departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    if (returning) {
      [destinationIATA, originIATA] = (query?.id as string)?.split('-');
      departureDate = jmoment(query?.returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    }

    if (!departureDate) throw new Error('departureDate not found');

    getFlightAlert({
      originIATA,
      destinationIATA,
      departureDate,
    }).then((flightAlertData) => {
      setData(flightAlertData);
    });
  };

  const deactivate = () => {
    setIsLoading(true);

    let [originIATA, destinationIATA] = (query?.id as string)?.split('-');
    let departureDate = jmoment(query?.departureDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    if (returning) {
      [destinationIATA, originIATA] = (query?.id as string)?.split('-');
      departureDate = jmoment(query?.returningDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
    }

    departureDate &&
      updateFlightAlert({
        originIATA,
        destinationIATA,
        departureDate,
        activation: false,
      })
        .then((res) => {
          setData({ ...data, ...res });
          toast('.اطلاع‌رسانی پرواز غیر فعال شد', toastOptions);
        })
        .catch((error) => {
          toast.error(error.response.data.message, toastOptions);
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  const onClick = () => {
    if (data?.activation === false) {
      if (!login) return setLoginModalVisible(true);
      fetchData();
      return setModalVisible(true);
    }

    deactivate();
  };

  useEffect(() => {
    fetchData();
  }, [query?.returningDate, query?.departureDate]);

  return data ? (
    <div className={styles['container']}>
      <div className={styles['content']}>
        <div className={styles['icon-container']}>
          <DomesticFlightReminderMockPhone />
        </div>
        <div style={{ color: data.message?.colorCode }}>
          <div className={styles['title']}>{data.message?.title}</div>
        </div>
      </div>
      <Button className={styles['action']} onClick={onClick} loading={isLoading}>
        <div className={styles['text-container']}>
          <span style={{ color: data.Header?.colorCode }} className={styles['text']}>
            {data.Header?.title}
          </span>
          {data?.activation && (
            <span className={styles['subtext']}>{data?.selectedOptionText}</span>
          )}
        </div>
        <SwitchButton checked={data.activation} />
      </Button>
      <SubmitModal
        data={data}
        setData={setData}
        visibleState={[modalVisible, setModalVisible]}
        returning={returning}
      />
    </div>
  ) : null;
};
