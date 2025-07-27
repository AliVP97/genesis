import cn from 'classnames';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import DownloadButton from './components/downloadButton';
import DownloadLink from './components/downloadLink';
import styles from './download.module.scss';
import { DownloadProps } from './types';

const Download = ({ image, title, body }: DownloadProps) => {
  return (
    <div className={cn(styles.download, 'row')} dir="rtl">
      <div className="col-12 col-md-6 d-flex justify-content-end">
        <DownloadLink title={title} body={body} />
      </div>
      <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start  mt-4 mt-md-0">
        <div className="w-50">
          <Image
            src={image?.url ?? ' http://780.ir'}
            loader={customLoader}
            alt={'download-دانلود'}
            unoptimized={true}
            width={220}
            height={400}
          />
        </div>
        <div className={cn(styles.download__btn, 'd-block d-md-none text-center')}>
          <p className="py-2">
            <b>دانلود اپلیکیشن 780 </b>
          </p>
          <h6 className="my-3"> </h6>
          <DownloadButton />
        </div>
      </div>
    </div>
  );
};

export default Download;
