import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';

import useClubChance from 'utils/hooks/useClubChance';
import { useSessionStorage } from 'components/payment/hooks/useSessionStorage';

import { UserScore } from 'assets/icons';
import styles from './chancecard.module.scss';

interface Props {
  price?: string | number;
  message?: string;
  serviceIdProps?: string;
  className?: string;
}
const ChanceCard: FC<Props> = ({ price, message, serviceIdProps, className }) => {
  const { score, mutateUserChance, isLoading } = useClubChance();
  const { getString } = useSessionStorage();

  const sessionServiceId = getString('serviceId');

  const [userChance, setUserChance] = useState<string | number>();
  const [hasScore, setHasScore] = useState(false);

  useEffect(() => {
    if (price && !message) {
      if (!!serviceIdProps || !!sessionServiceId) {
        mutateUserChance(
          {
            price: String(price).replace(/,/g, ''),
            serviceId: (serviceIdProps || sessionServiceId) as string,
          },
          {
            onSuccess(data) {
              if (data?.message) {
                setHasScore(true);
                setUserChance(data.message);
              } else {
                setHasScore(false);
              }
            },
          },
        );
      }
    }
  }, []);

  useEffect(() => {
    if (score && score.message) {
      setHasScore(true);
      setUserChance(score.message);
    }
  }, [score]);

  if (isLoading) {
    return <div className="w-100 p-4 skeleton rounded-3" />;
  }

  return hasScore ? (
    <div className={classNames(styles['cards-container'], className)}>
      <UserScore />
      <span className="d-flex align-items-center justify-content-center ">{userChance}</span>
    </div>
  ) : null;
};

export default ChanceCard;
