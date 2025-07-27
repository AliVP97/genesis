import React from 'react';
import styles from './button.module.scss';

type AppDownloadBtnProps = {
  id?: number;
  title: string;
  src: unknown;
  link?: string;
};

const AppDownloadBtn = ({ title, src, link }: AppDownloadBtnProps) => {
  return (
    <>
      <a href={link} target="_blank" rel="noreferrer">
        <button className={styles['app-download-btn']}>
          <div className={styles['app-download-btn__container']}>
            <p>{title}</p>
            {src}
          </div>
        </button>
      </a>
    </>
  );
};

export default AppDownloadBtn;
