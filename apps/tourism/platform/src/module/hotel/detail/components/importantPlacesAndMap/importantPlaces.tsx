import React from 'react';
import { TImportantPlaces } from '.';
import styles from './importantPlacesAndMap.module.scss';
interface ImportantPlacesProps extends TImportantPlaces {
  showPlacesOnMap: () => void;
  containerStyles?: React.CSSProperties;
}

const ImportantPlaces = ({ places, containerStyles }: ImportantPlacesProps) => {
  return (
    <div
      style={{ ...containerStyles }}
      className={!!places && places.length < 4 ? '' : `${styles['scroll_bar']}`}
    >
      {places?.map((item, idx) => {
        return (
          <div key={idx.toString() + 'hotelDetailMap'} className="ms-2 ">
            <div className={styles['card']}>
              <div>{item?.distance || ' '}</div>
              <div>{item?.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImportantPlaces;
