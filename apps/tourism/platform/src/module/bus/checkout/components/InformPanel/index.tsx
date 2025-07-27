import { FC, ReactNode } from 'react';

import { Info } from 'assets/icons';

import styles from './styles.module.scss';

type TInformPanelProps = { children?: ReactNode };

export const InformPanel: FC<TInformPanelProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Info className={styles.icon} />
      <p>{children}</p>
    </div>
  );
};
