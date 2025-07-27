import { FC } from 'react';
import style from '../style.module.scss';
import { SupportHeaderProps } from './types';
import Image from 'next/image';
import Button from 'components/button';
import { useRouter } from 'next/router';

const SupportHeader: FC<SupportHeaderProps> = ({ surveyButton, image }) => {
  const { push } = useRouter();
  const { query } = useRouter();
  if (!surveyButton?.isActive) {
    return (
      <>
        {image?.url && (
          <Image
            src={image?.url}
            objectFit="contain"
            alt="support image"
            width={284}
            height={284}
          />
        )}
      </>
    );
  }
  return (
    <div className={style.header}>
      {image?.url && <Image src={image?.url} alt="support image" width={290} height={292} />}
      <Button
        className={style.header__button}
        onClick={() => {
          push(`${surveyButton?.link}${query?.ssid}`);
        }}
      >
        {surveyButton?.title}
      </Button>
    </div>
  );
};

export default SupportHeader;
