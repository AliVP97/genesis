import cn from 'classnames';
import Image, { StaticImageData } from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import DownloadButton from './components/downloadButton';
import DownloadLink from './components/downloadLink';
import styles from './download.module.scss';

type DownloadProps = {
  image: StaticImageData;
};

const Download = ({ image }: DownloadProps) => {
  return (
    <>
      <div className={cn(styles['download'], 'row')}>
        <div className="col-12 col-md-6">
          <DownloadLink />
        </div>
        <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start  mt-4 mt-md-0">
          <div className="w-50">
            <Image src={image} loader={customLoader} alt={'download-دانلود'} unoptimized={true} />
          </div>
          <div className={cn(styles['download__btn'], 'd-block d-md-none text-center')}>
            <p className="py-2">
              <b>دانلود اپلیکیشن 780 </b>
            </p>
            <h6 className="my-3"> </h6>
            <DownloadButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Download;
