import { Banner } from '../../../types/api';

type ImageSizeKeys = 'MOBILE' | 'TABLET' | 'DESKTOP';

type ImageSize = {
  height: number;
  width: number;
};

const IMAGE_SIZES: Record<ImageSizeKeys, ImageSize> = {
  MOBILE: { height: 150, width: 450 },
  TABLET: { height: 155, width: 960 },
  DESKTOP: { height: 155, width: 1200 },
};

type ImageData = {
  src: string;
  width: number;
  height: number;
};

const createImageData = (src = '', ImageSize = IMAGE_SIZES.DESKTOP): ImageData => ({
  src,
  width: ImageSize.width,
  height: ImageSize.height,
});

/**
 * Get image data based on the element width and banner images.
 * @param banner a list of  banner images
 * @param elementWidth width of the element
 * @returns image data
 */
export default function getImageData(banner: Banner | undefined, elementWidth: number): ImageData {
  if (!banner) {
    return createImageData();
  }

  const { mobileBannerSrc, tabletBannerSrc, desktopBannerSrc } = banner;

  if (elementWidth <= IMAGE_SIZES.MOBILE.width) {
    return createImageData(mobileBannerSrc, IMAGE_SIZES.MOBILE);
  }

  if (elementWidth <= IMAGE_SIZES.TABLET.width) {
    return createImageData(tabletBannerSrc, IMAGE_SIZES.TABLET);
  }

  return createImageData(desktopBannerSrc, IMAGE_SIZES.DESKTOP);
}
