import { useState } from 'react';

export const UseGallery = () => {
  const [visibleGallery, setVisibleGallery] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const setVisibleGalleryModal = () => {
    setVisibleGallery((prev) => !prev);
  };

  const onSelectImage = (index: number) => {
    setImageIndex(index);
  };

  return {
    visibleGallery,
    imageIndex,
    onSelectImage,
    setVisibleGalleryModal,
    setImageIndex,
  };
};
