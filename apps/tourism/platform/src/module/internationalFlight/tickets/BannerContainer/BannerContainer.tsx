import { memo, useMemo } from 'react';
import { Banner } from '../types/api';
import BannerImage from './BannerImage';
import useElementWidth from './hooks/useElementWidth';
import getImageData from './helpers/getImageData';

interface BannerContainerProps {
  data: Banner | undefined;
}

const BannerContainer = memo(({ data }: BannerContainerProps) => {
  const { elementRef, elementWidth } = useElementWidth();
  const { src, height, width } = useMemo(
    () => getImageData(data, elementWidth),
    [data, elementWidth],
  );

  return (
    <BannerImage src={src} width={width} height={height} ref={elementRef} alt={data?.title ?? ''} />
  );
});

BannerContainer.displayName = 'BannerContainer';

export default BannerContainer;
