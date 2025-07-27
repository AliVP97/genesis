import Image, { ImageProps } from 'next/image';
import React, { FC } from 'react';

export interface INextImageProps extends ImageProps {
  alt: string;
  src: string;
  width: number;
  height: number;
  className?: string;
}

const myLoader = ({ src }: { src: string }) => {
  return `${src}`;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#b4b4b4" offset="20%" />
       <stop stop-color="#e3e3e3" offset="50%" />
      <stop stop-color="#b4b4b4" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#b4b4b4" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const NextImage: FC<INextImageProps> = ({
  src,
  width,
  height,
  className = '',
  alt,
  objectFit = 'fill',
  ...rest
}) => {
  return (
    <Image
      loader={myLoader}
      alt={alt}
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
      src={src}
      width={width}
      height={height}
      className={className}
      objectFit={objectFit}
      quality={100}
      unoptimized
      {...rest}
    />
  );
};
