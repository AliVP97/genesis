import { FC, RefObject } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import Button from 'components/button';

import { DownloadIcon, ShareIcon } from 'assets/icons';
import styles from './ShareButtons.module.scss';
import { useShareButtons } from './useShareButtons';

type TShareButtonsProps = { elementRef: RefObject<HTMLElement> };

export const ShareButtons: FC<TShareButtonsProps> = ({ elementRef }) => {
  const { handleShare, handleDownloadImage, shareLoading, downloadLoading } = useShareButtons(
    elementRef,
    `receipt-${new Date().getTime()}.png`,
  );

  return (
    <div className="position-relative w-100">
      <div className={cn(styles['share__buttons'])} data-html2canvas-ignore="true">
        <Button
          loading={downloadLoading as boolean}
          className="btn"
          onClick={() => handleDownloadImage()}
        >
          <DownloadIcon className={styles['download-icon']} />
          <span>ذخیره در گالری</span>
        </Button>
        <Button
          loading={shareLoading as boolean}
          className="btn"
          onClick={() => handleShare('رسید تراکنش')}
        >
          <ShareIcon className={styles['share-icon']} />
          <span>ارسال برای دیگران</span>
        </Button>
      </div>
      <div className={styles['share__logo']}>
        <Image
          src="https://public.780.ir/dl/images/780logo.png"
          alt="images/780_name.png"
          objectFit="contain"
          height={24}
          width={150}
        />
      </div>
    </div>
  );
};
