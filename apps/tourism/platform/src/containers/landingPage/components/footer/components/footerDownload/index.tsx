import styles from './footerDownload.module.scss';
import Modal from 'components/modal';
import DownloadApplication from 'containers/landingPage/components/download/components/downloadModal';
import { useState } from 'react';
import { IDownloadInformation } from 'containers/landingPage/types';
import { AndroidIcon, DirectDownloadBlueIcon, IosIcon, PWAIcon } from 'assets/icons';
import {
  androidDownloadInfo,
  DIRECT_DOWNLOAD,
  iosDownloadInfo,
  PWA_ACCESS_ADDRESS,
} from 'containers/landingPage/data/index';
import Link from 'next/link';

const FooterDownload = () => {
  const [download, setDownload] = useState<boolean>(false);
  const [info, setInfo] = useState<IDownloadInformation>();

  const handleDownloadModal = (info: IDownloadInformation) => {
    setDownload(true);
    setInfo(info);
  };

  return (
    <>
      <div className={styles['footer-download']}>
        <div className={styles['footer-download__section']}>
          <button
            onClick={() => handleDownloadModal(androidDownloadInfo)}
            className={styles['footer-download__section__button']}
          >
            <div className={styles['footer-download__section__button__text']}>
              دانلود نسخه اندروید
            </div>
            <AndroidIcon className={styles['footer-download__section__button__icon']} />
          </button>
        </div>
        <div className={styles['footer-download__section']}>
          <button
            onClick={() => handleDownloadModal(iosDownloadInfo)}
            className={styles['footer-download__section__button']}
          >
            <div className={styles['footer-download__section__button__text']}>دانلود نسخه iOS</div>
            <IosIcon className={styles['footer-download__section__button__icon']} />
          </button>
        </div>
        <div className={styles['footer-download__section']}>
          <Link href={PWA_ACCESS_ADDRESS} target="_blank" rel="noreferrer" passHref>
            <div className={styles['footer-download__section__button']}>
              <div className={styles['footer-download__section__button__text']}>دانلود نسخه وب</div>
              <PWAIcon className={styles['footer-download__section__button__icon']} />
            </div>
          </Link>
        </div>
        <div className={styles['footer-download__section']}>
          <Link href={DIRECT_DOWNLOAD} target="_blank" rel="noreferrer" passHref>
            <div className={styles['footer-download__section__button']}>
              <div className={styles['footer-download__section__button__text']}>
                دانلود از لینک مستقیم
              </div>
              <DirectDownloadBlueIcon
                className={styles['footer-download__section__button__icon']}
              />
            </div>
          </Link>
        </div>
        <Modal onClose={() => setDownload(false)} visible={download}>
          <DownloadApplication
            close={() => setDownload(false)}
            buttons={info?.downloadBtns}
            title={info?.title}
          />
        </Modal>
      </div>
    </>
  );
};

export default FooterDownload;
