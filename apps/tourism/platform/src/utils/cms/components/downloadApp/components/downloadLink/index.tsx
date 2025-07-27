import cn from 'classnames';
import DownloadButton from '../downloadButton';
import styles from '../../download.module.scss';
import parse from 'html-react-parser';

const DownloadLink = ({ title, body }: { title?: string; body?: string }) => {
  return (
    <>
      <div className="d-flex justify-content-center justify-content-md-end h-100  w-100">
        <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center">
          <p>
            <b>{title ?? ''}</b>
          </p>

          <div className="pt-1 d-none d-md-block">
            <small>{parse(body ?? '')}</small>
          </div>

          <div className={cn(styles.download__btn, 'mt-3 d-none d-md-flex px-5 w-100 text-nowrap')}>
            <DownloadButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadLink;
