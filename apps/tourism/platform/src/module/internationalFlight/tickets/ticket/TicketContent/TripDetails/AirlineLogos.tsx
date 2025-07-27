import styles from './AirlineLogos.module.scss';
import React, { Fragment, useMemo } from 'react';
import Airline from '../../types/Airline';
import cn from 'classnames';
import Image from 'next/image';
import { DomesticFlightIcon } from 'assets/icons';
import Popover from '../Popover';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

interface AirlineLogosProps {
  data: Airline[] | undefined;
}

const AirlineLogos = ({ data }: AirlineLogosProps) => {
  const { isMobile } = useDeviceDetect();
  const isMany = data && data?.length > 1;
  const imageContainerRefs = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return Array.from({ length: data.length }, () => React.createRef<HTMLDivElement>());
  }, [data?.length]);

  return (
    <div className={styles.root}>
      <div className={cn(styles.container, isMany && styles.many)}>
        {data?.map((logo, index) => (
          <Fragment key={index.toString() + logo?.logoUri}>
            <div className={styles['image-container']} ref={imageContainerRefs[index]}>
              <Image
                src={logo?.logoUri ?? DomesticFlightIcon}
                alt="airline logo"
                height={96}
                width={96}
              />
            </div>
            {!isMany && (
              <div
                className={cn(
                  'd-md-block d-inline me-2 m-md-0 mt-md-2 text-truncate w-100 ltr text-center',
                  styles.title,
                )}
              >
                {logo?.name?.english}
              </div>
            )}
            {isMany && !isMobile && (
              <Popover
                className={styles.popover}
                anchorEl={imageContainerRefs[index].current}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
              >
                {logo?.name?.english}
              </Popover>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default AirlineLogos;
