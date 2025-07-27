import { FC, ReactElement } from 'react';

import { Info } from 'assets/icons';

import styles from './styles.module.scss';
import classNames from 'classnames';

export type TAlertPanelVaraints = 'success' | 'info' | 'warning' | 'error';

type TAlertPanelProps = {
  variant?: TAlertPanelVaraints;
};

const iconMapper: Record<TAlertPanelVaraints, ReactElement> = {
  success: <i />,
  info: <Info className={styles.icon} />,
  warning: <i />,
  error: <i />,
};

const AlertPanel: FC<TAlertPanelProps> = ({ children, variant = 'info' }) => {
  return (
    <div className={classNames(styles['container'], styles[variant])}>
      {iconMapper[variant]}
      <p>{children}</p>
    </div>
  );
};

export default AlertPanel;
