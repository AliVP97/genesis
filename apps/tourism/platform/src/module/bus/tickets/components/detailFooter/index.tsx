import { FC } from 'react';

import cn from 'classnames';

import Button from 'components/button';
import { useRouteChange } from '../../../../../utils/hooks/useRouteChange';

import styles from '../busDetail/ticketDetail.module.scss';

interface Props {
  onSelectTicket: () => void;
}

export const DetailFooter: FC<Props> = ({ onSelectTicket }) => {
  const { routeChangeStarted } = useRouteChange();

  return (
    <div className={cn(styles['ticket-detail__footer'], 'p-3')}>
      <div className="pt-3">
        <Button
          onClick={() => onSelectTicket()}
          className={cn(
            styles['ticket-detail__footer__btn'],
            'justify-content-center d-flex align-items-center text-weight-500',
          )}
          loading={routeChangeStarted}
        >
          تایید و انتخاب صندلی
        </Button>
      </div>
    </div>
  );
};
