import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import styles from '../style.module.scss';
import { PrepositionItemProps } from '../types';

const PrepositionItem = ({ title, body, image }: PrepositionItemProps) => {
  return (
    <>
      <div className="py-4 d-flex flex-column align-items-center text-center">
        <div className={styles['services__each-item__image']}>
          <Image
            loader={customLoader}
            src={image?.url ?? ' http://780.ir'}
            alt={title}
            unoptimized={true}
            width={70}
            height={78}
          />
        </div>
        <div className="py-1 pb-2">
          <h5 className="color-primary mb-0">{title}</h5>
        </div>
        <div>
          <small className="color-on-surface-var font-weights-500">{body}</small>
        </div>
      </div>
    </>
  );
};
export default PrepositionItem;
