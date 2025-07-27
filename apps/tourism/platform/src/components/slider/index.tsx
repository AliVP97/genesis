import styles from './slider.module.scss';

import SliderItem from './components/item';
import SliderDots from './components/dots';
import UseSlider from './hooks/useSlider';
import React from 'react';
import { HotelSliderArrow } from 'assets/icons';
export type StartPos = 'rtl' | 'ltr';
type TSliderProps = {
  images: Array<string>;
  title: string;
  dots?: boolean;
  startPos?: StartPos;
};

const Slider = ({ images, title, dots = true, startPos }: TSliderProps) => {
  const {
    currentIndex,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    setCurrentIndex,
    setCurrentIndexNext,
    setCurrentIndexPrev,
  } = UseSlider(images?.length - 1, startPos);
  return (
    <>
      <div
        className={styles.slider}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images &&
          images.map((image, index) => {
            return (
              <React.Fragment key={index.toString() + image + 'hotelSlider'}>
                <SliderItem dots={dots} currentIndex={currentIndex} image={image} title={title} />
              </React.Fragment>
            );
          })}
        {dots ? (
          <SliderDots
            currentIndex={currentIndex}
            images={images}
            setCurrentIndex={setCurrentIndex}
          />
        ) : (
          images.length > 1 && (
            <div>
              <div className={styles.slider__slideNext}>
                <div onClick={() => setCurrentIndexNext()}>
                  <HotelSliderArrow />
                </div>
              </div>
              <div className={styles.slider__slidePrev}>
                <div onClick={() => setCurrentIndexPrev()}>
                  <HotelSliderArrow style={{ transform: 'rotate(180deg)' }} />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Slider;
