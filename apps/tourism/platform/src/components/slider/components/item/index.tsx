import Image from 'next/image';
import styles from './item.module.scss';
import cn from 'classnames';
import { TourDefaultBanner } from 'assets/images';
interface ISliderItemProps {
  image: string;
  title: string;
  currentIndex: number;
  dots: boolean;
}
const SliderItem = ({ image, title, currentIndex, dots = true }: ISliderItemProps) => {
  return (
    <>
      <div
        className={cn(dots ? styles['slide-item'] : styles.item)}
        style={{
          transform: dots
            ? `translate(-${currentIndex * 100}%)`
            : `translate(+${currentIndex * 100}%)`,
        }}
      >
        <Image
          loader={() => image}
          src={`${image || TourDefaultBanner}`}
          alt={title || 'Tour'}
          layout="fill"
        />
      </div>
    </>
  );
};

export default SliderItem;
