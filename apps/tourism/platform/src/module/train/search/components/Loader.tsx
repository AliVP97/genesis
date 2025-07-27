import { FC } from 'react';

import dynamic from 'next/dynamic';
import cn from 'classnames';

import Skeleton from 'components/skeleton';
import { useGetLotties } from 'module/general/config/hooks/useGetLotties';
import { useResponsive } from 'utils/hooks/useResponsive';
import { MESSAGES } from '../constants';

import skeletonStyles from 'components/skeleton/skeleton.module.scss';

const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((module) => module.Player),
  { ssr: false },
);

type TProps = {
  className?: string;
};

const Mobile: FC<TProps> = ({ className }) => {
  const { trainLottie } = useGetLotties();

  return (
    <div className={className}>
      <div className="col-6 mx-auto">
        <Player src={trainLottie} className="player" loop autoplay />
      </div>

      <div className="rtl d-flex justify-content-center p-3">{MESSAGES.searching} </div>
      {[...Array(4)].map((_, index) => (
        <Skeleton
          type="ticket"
          key={index.toString() + 'trainSearch'}
          rtl
          uniqueKey="0"
          className={skeletonStyles.skeleton__tickets}
        />
      ))}
    </div>
  );
};

const Desktop: FC<TProps> = ({ className }) => {
  const { trainLottie } = useGetLotties();

  return (
    <div className={cn(className, 'my-3')}>
      <div className="row justify-content-md-center">
        <div className="col-2">
          <Player src={trainLottie} className="player" loop autoplay />
        </div>
      </div>

      <div className="rtl d-flex justify-content-center p-3">{MESSAGES.searching}</div>
      <div className="row rtl ">
        <div>
          <Skeleton
            type="sort"
            rtl
            uniqueKey="sort"
            className="bg-color-white p-2 mb-3"
            height="50"
            width="100%"
          />
          {[...Array(6)].map((item, index) => (
            <Skeleton
              type="ticket"
              key={index.toString() + 'trainSearchSkeleton2'}
              rtl
              uniqueKey="ticket"
              className={skeletonStyles.skeleton__tickets}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Loader: FC<TProps> = ({ className }) => {
  const { isMobile } = useResponsive();

  return isMobile ? <Mobile className={className} /> : <Desktop className={className} />;
};
