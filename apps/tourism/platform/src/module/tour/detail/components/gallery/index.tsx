import React from 'react';
import cn from 'classnames';
import {
  CloseIcon,
  DatePickerRightArrow,
  GalleryIcon,
  ShareIcon,
  SliderLeft,
  SliderRight,
} from 'assets/icons';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import Style from './style.module.scss';
import { useRouter } from 'next/router';
import { useCopyToClipboard } from 'utils/hooks/useCopyToClipboard';
import { TourDetailGallery } from '../imageGroup';
import Slider from 'components/slider';
import Modal from 'components/modal';
import Image from 'next/image';
import { UseGallery } from './useGallery';

import styles from './style.module.scss';
export const TourGallery = ({
  image,
  title,
  content,
}: {
  image: Array<string>;
  title: string;
  content: string;
}) => {
  const { onCopy } = useCopyToClipboard();
  const { isMobile } = useDeviceDetect();
  const router = useRouter();
  const { asPath } = useRouter();

  const { visibleGallery, onSelectImage, imageIndex, setVisibleGalleryModal, setImageIndex } =
    UseGallery();
  const renderContent = () => {
    const shareIconColor = isMobile ? '#105FAE' : '#194b9b';
    const titleSize = isMobile ? 'fs-3' : 'fs-4';
    const subtitleSize = isMobile ? 'fs-2' : 'fs-4';
    const subtitleColor = isMobile ? 'color-grey-23' : '';
    const titlePadding = isMobile ? '' : 'pe-4';

    return (
      <div
        className={cn(
          isMobile
            ? 'd-flex flex-row justify-content-between align-items-center p-4'
            : 'card bg-color-white-2 d-flex flex-row justify-content-between align-items-center p-4',
        )}
      >
        <div
          onClick={async () => {
            await onCopy('https://780.ir/tourism' + asPath);
          }}
          className="d-flex flex-row cursor-pointer"
        >
          <ShareIcon fill={shareIconColor} />
          <div className="ps-2 color-primary fs-4 text-weight-500">اشتراک گزاری</div>
        </div>
        <div className="d-flex flex-row justify-content-center align-items-center">
          <div dir="rtl" className={cn('d-flex flex-column', titlePadding)}>
            <div className={cn('text-weight-500', titleSize)}>{title}</div>
            <div className={cn('text-weight-500', subtitleSize, subtitleColor)}>{content}</div>
          </div>
          {!isMobile && (
            <div
              onClick={() => router.back()}
              className={cn(Style['circle-back'], 'cursor-pointer')}
            >
              <DatePickerRightArrow fill="#536279" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div>
        {!isMobile && renderContent()}
        {isMobile ? (
          <Slider startPos="rtl" images={image} title={''} />
        ) : (
          <TourDetailGallery images={image} setVisibleGalleryModal={setVisibleGalleryModal} />
        )}
      </div>
      <Modal visible={visibleGallery} onClose={() => setVisibleGalleryModal()}>
        <div className={cn(styles['parent-modal'], 'bg-white p-4')}>
          <div
            className={cn(
              styles['modal-header'],
              'd-flex flex-row-reverse justify-content-between align-items-center pb-3',
            )}
          >
            <div className="d-flex flex-row align-items-center">
              <div className="pe-2 text-black color-black text-weight-500">
                گالری تصاویر {title}
              </div>
              <GalleryIcon />
            </div>
            <div className="cursor-pointer" onClick={() => setVisibleGalleryModal()}>
              <CloseIcon style={{ transform: 'scale(1.3)' }} />
            </div>
          </div>
          <div className="col-12 pt-3 d-flex justify-content-center align-items-center">
            {image && (
              <div className="position-relative w-100">
                <div
                  style={{ zIndex: 1 }}
                  className="position-absolute h-100 w-100  d-flex justify-content-between align-items-center "
                >
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (imageIndex > 0) {
                        setImageIndex((prev) => prev - 1);
                      }
                    }}
                    className="mx-3"
                  >
                    {' '}
                    <SliderLeft />
                  </div>
                  <div
                    role="button"
                    onClick={(e) => {
                      if (imageIndex < image.length - 1) {
                        e.stopPropagation();
                        setImageIndex((prev) => prev + 1);
                      }
                    }}
                    className="mx-3"
                  >
                    <SliderRight />
                  </div>
                </div>
                <Image
                  className={styles['parent-big-image']}
                  src={`${image[imageIndex]}`}
                  alt="no filter found"
                  width="960"
                  height="400"
                  unoptimized
                />
              </div>
            )}
          </div>
          <div className={cn(styles.scroll)}>
            {image?.map((ele, ind) => {
              return (
                <div
                  onClick={() => {
                    onSelectImage(ind);
                  }}
                  key={ind.toString() + 'moduleDetailHotel'}
                  className={cn(styles['image-item'], 'col-3 d-inline-block p-2 cursor-pointer')}
                >
                  <div
                    className={cn(
                      imageIndex == ind ? styles['image-selected'] : styles['parent-big-image'],
                    )}
                  >
                    <Image
                      className={cn(styles['parent-big-image'])}
                      // loader={() => hotel?.details?.images[0]}
                      src={ele}
                      // layout="fill"
                      alt="no filter found"
                      width="252"
                      height="170"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      {isMobile && renderContent()}
    </>
  );
};
