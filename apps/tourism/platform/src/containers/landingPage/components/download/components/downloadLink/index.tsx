import cn from 'classnames';
import DownloadButton from '../downloadButton';
// import SendDownloadLink from '../sendLink';
import styles from '../../download.module.scss';
const DownloadLink = () => {
  return (
    <>
      <div className="d-flex justify-content-center justify-content-md-end h-100">
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center">
          <p>
            <b>پرداخت سریعتر و آسانتر، شانس بیشتر!</b>
          </p>
          <div>
            <small>برای دریافت اپلیکیشن هف‌هشتاد از طریق لینک های زیر اقدام کنید.</small>
          </div>
          <div className="pt-1 d-none d-md-block">
            <small>یا جهت دریافت لینک دانلود شماره موبایل خود را وارد نمایید.</small>
          </div>
          {/*TODO: Send download link doesn't work properly on the back end*/}
          {/*<div className="w-100 px-2 mx-3 mt-3 d-none d-md-block">*/}
          {/*  <SendDownloadLink />*/}
          {/*</div>*/}
          <div className={cn(styles['download__btn'], 'mt-3 d-none d-md-flex px-2 w-100')}>
            <DownloadButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadLink;
