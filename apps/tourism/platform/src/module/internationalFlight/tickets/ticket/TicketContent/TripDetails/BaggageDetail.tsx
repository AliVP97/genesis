import styles from './BaggageDetail.module.scss';
import { LuggageIcon, NoLuggageIcon } from 'assets/icons';
import React from 'react';

export interface BaggageDetailProps {
  text?: string;
  status: 'available' | 'not-available' | 'no-information';
}

const BaggageDetail = ({ status, text }: BaggageDetailProps) => (
  <div className={styles.root}>
    {status === 'available' && (
      <>
        <LuggageIcon className={styles['luggage-icon']} />
        <span dir={'ltr'} className={styles['text']}>
          {text}
        </span>
      </>
    )}
    {status === 'not-available' && (
      <>
        <NoLuggageIcon /> <span className={styles['no-luggage-text']}>بدون بار</span>
      </>
    )}
  </div>
);

export default BaggageDetail;
