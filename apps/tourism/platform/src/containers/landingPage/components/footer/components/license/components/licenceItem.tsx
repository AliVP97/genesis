import cn from 'classnames';
import Image, { StaticImageData } from 'next/image';
import styles from '../license.module.scss';

type LicenseItemProps = {
  title?: string;
  src: StaticImageData;
  link?: string;
};

const LicenseItem = ({ src, title, link }: LicenseItemProps) => {
  return (
    <>
      <div className={cn(styles['license__item'], 'cur')}>
        <a href={link} rel="noreferrer" target="_blank">
          <Image src={src} alt={title} width="" />
        </a>
      </div>
    </>
  );
};

export default LicenseItem;
