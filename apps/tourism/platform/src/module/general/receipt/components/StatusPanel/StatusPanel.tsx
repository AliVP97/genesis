import { FC } from 'react';
import classNames from 'classnames';

import { definitions } from 'types/payment';

import { CloseCircleWhiteIcon, DoneIcon, InfoIcon } from 'assets/icons';
import styles from './StatusPanel.module.scss';

type TStatusPanelProps = {
  data: definitions['paymentOrderReceiptResponse']['status'] | undefined;
};

const statusIconMapper = (status?: string) => {
  const mapper = {
    success: <DoneIcon />,
    failed: <CloseCircleWhiteIcon width="37" height="37" />,
    pending: <InfoIcon className="fill-white" />,
  };

  if (status && status in mapper) {
    return mapper[status as keyof typeof mapper];
  }

  return null;
};

const statusClassMapper = (status?: string) => {
  const mapper = {
    success: styles['icon--success'],
    failed: styles['icon--failed'],
    pending: styles['icon--unknown'],
  };

  if (status && status in mapper) {
    return mapper[status as keyof typeof mapper];
  }

  return null;
};

export const StatusPanel: FC<TStatusPanelProps> = ({ data }) => {
  return (
    <div className={styles['container']}>
      <div className={classNames(styles['icon'], statusClassMapper(data?.type))}>
        {statusIconMapper(data?.type)}
      </div>
      <div
        className={classNames(
          styles['title'],
          data?.type === 'success'
            ? styles['--success']
            : data?.type === 'failed'
              ? styles['--failed']
              : styles['--unknown'],
        )}
      >
        <span className={data?.type === 'success' ? 'color-green-1' : 'color-red-1'}>
          {data?.text}
        </span>
      </div>
    </div>
  );
};
