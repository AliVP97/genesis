import { FC } from 'react';

import { IconMapper, MESSAGES } from './utils';

import styles from './styles.module.scss';

const shouldShowMessage = (activeTab?: string) => {
  return (
    activeTab == 'train' || activeTab === 'train/[id]' || activeTab === 'train/companies/[name]'
  );
};

export const InformPanel: FC<{ activeTab?: string }> = ({ activeTab }) => {
  return (
    <>
      {shouldShowMessage(activeTab) &&
        MESSAGES?.map(({ type, text }) => (
          <div className={styles.container} key={text}>
            <IconMapper iconType={type} className={styles.icon} />
            <p dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        ))}
    </>
  );
};
