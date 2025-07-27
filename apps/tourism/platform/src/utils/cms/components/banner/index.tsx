import { FC } from 'react';
import classNames from 'classnames';
import styles from './style.module.scss';
import { ApiResponse, BannerProps } from './type';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

export const NewTopBanner: FC = () => {
  const [bannerData, setBannerData] = useState<BannerProps>();

  const { pathname } = useRouter();

  const { data: topBannerData } = useQuery(
    'topBanner',
    () =>
      axios
        .get<ApiResponse>(process.env.NEXT_PUBLIC_CMS_BASE_URL + '/api/notifications')
        .then(({ data }) => data.data),
    {},
  );

  const openNewTab = (link: string) => {
    if (!link) return;

    const isExternal = /^https?:\/\//i.test(link);
    const fullUrl = isExternal ? link : bannerData?.external ? `https://${link}` : link;

    if (bannerData?.external) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(fullUrl, '_self');
    }
  };
  const isValid = (data: BannerProps, path: string) => {
    if (path === '/' && data.service === '<tourism>') {
      //Notice: The CMS path name is defined as <tourism>.
      path = '<tourism>';
    }
    if (
      data?.bannerstatus &&
      (path === '<tourism>' ? true : data?.service === path.split('/')[1])
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!topBannerData) return;
    const validBanner = topBannerData.find((data) => isValid(data, pathname));
    if (validBanner?.bannerstatus) {
      setBannerData(validBanner);
    } else if (bannerData) {
      setBannerData(undefined);
    }
  }, [topBannerData, pathname]);

  useEffect(() => {
    // scroll to top because of layout shift
    // this issue only happen on google chrome as we checked
    // TODO find a solution for it
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 400);
  }, [bannerData]);

  return bannerData ? (
    <button
      className={classNames(styles.container, !bannerData?.action && styles['action-disabled'])}
      onClick={() => {
        openNewTab(bannerData?.link);
      }}
    >
      <span className={styles['action-button']}>{bannerData?.action}</span>
      {bannerData?.title && <span className={styles.title}>{bannerData?.title}</span>}
    </button>
  ) : null;
};
