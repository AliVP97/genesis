import cn from 'classnames';
import styles from '../../slider.module.scss';

interface ISliderDotsProps {
  images: Array<string>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
}

const SliderDots = ({ images, setCurrentIndex, currentIndex }: ISliderDotsProps) => {
  return (
    <>
      <div className={styles.slider__dots}>
        {images?.map((_, index) => (
          <div
            key={index.toString() + 'tourDots'}
            className={cn(
              styles.slider__dots__item,
              index === currentIndex && styles['slider__dots__item--active'],
            )}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </>
  );
};
export default SliderDots;
