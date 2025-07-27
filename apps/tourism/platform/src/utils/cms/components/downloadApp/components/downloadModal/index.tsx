import { CloseIcon } from 'assets/icons';
import { AppDownload } from 'assets/images';
import { IAppDownloadBtn } from 'containers/landingPage/types';
import Image from 'next/image';
import AppDownloadBtn from './button';
import styles from './downloadModal.module.scss';

const DOWNLOAD_DESCRIPTION =
  'برای دریافت اپلیکیشن هف‌هشتاد می‌توانید از طریق تمامی لینک‌های زیر اقدام کنید.';
type DownloadApplicationProps = {
  title?: string;
  buttons?: Array<IAppDownloadBtn>;
  close: () => void;
};

const DownloadApplication = ({ title, buttons, close }: DownloadApplicationProps) => {
  return (
    <>
      <div className={styles['download-modal']}>
        <div>
          <div className={styles['download-modal__hedear__title']}>
            <CloseIcon onClick={close} />
            <span>{title}</span>
          </div>
          <div className={styles['download-modal__hedear__description']}>
            <p>{DOWNLOAD_DESCRIPTION}</p>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <Image src={AppDownload} alt="دانلود 780" width="" />
        </div>
        <div className="d-flex flex-column mt-3">
          {buttons?.map((item, index) => (
            <AppDownloadBtn
              id={item?.id ?? 0}
              title={item.title}
              src={item.src}
              link={item.link}
              key={index.toString() + item.title + 'downloadModal'}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DownloadApplication;
