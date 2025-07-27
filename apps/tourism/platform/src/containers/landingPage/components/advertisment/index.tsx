import Image, { StaticImageData } from 'next/image';
import styles from './advertisment.module.scss';
type AdvertismentProps = {
  src: StaticImageData;
  alt: string;
};

const Advertisment = ({ src, alt }: AdvertismentProps) => {
  return (
    <>
      <div className={styles['advertisment']}>
        <Image src={src} alt={alt} objectFit="cover" layout="fill" width="" />
      </div>
    </>
  );
};

export default Advertisment;
