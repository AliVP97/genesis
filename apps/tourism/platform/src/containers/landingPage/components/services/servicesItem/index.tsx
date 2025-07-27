import Image, { StaticImageData } from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';
import styles from '../services.module.scss';
type ServicesItemPropsType = {
  image: StaticImageData;
  title: string;
  description: string;
};

const ServicesItem = ({ image, title, description }: ServicesItemPropsType) => {
  return (
    <>
      <div className="py-4 d-flex flex-column align-items-center text-center">
        <div className={styles['services__each-item__image']}>
          <Image loader={customLoader} src={image} alt={title} unoptimized={true} />
        </div>
        <div className="py-1 pb-2">
          <h5 className="color-primary mb-0">{title}</h5>
        </div>
        <div>
          <small className="color-on-surface-var font-weights-500">{description}</small>
        </div>
      </div>
    </>
  );
};
export default ServicesItem;
