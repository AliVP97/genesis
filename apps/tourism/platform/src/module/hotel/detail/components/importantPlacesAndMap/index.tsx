import React, { useCallback, useState } from 'react';
import styles from './importantPlacesAndMap.module.scss';
import dynamic from 'next/dynamic';
import Modal from 'components/modal';
import ImportantPlaces from './importantPlaces';
import cn from 'classnames';
const DynamicMap = dynamic(() => import('components/map'), {
  ssr: false,
});
export interface TImportantPlaces {
  places?: { name?: string; time?: string; distance?: string }[];
  icon?: React.ReactNode;
}
interface ImportantPlacesAndMapProps extends TImportantPlaces {
  address?: string;
  location?: { lat?: number; long?: number };
  title: string;
}
const ImportantPlacesAndMap = ({
  address,
  icon,
  places,
  location,
  title,
}: ImportantPlacesAndMapProps) => {
  const [mapVisible, setMapVisible] = useState(false);
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  const isMap = location?.lat && location?.long;

  const handleBackBtn = () => {
    setMapVisible(false);
    setShowAllPlaces(false);
  };
  const showPlacesOnMap = useCallback(() => {
    setMapVisible(true);
    setShowAllPlaces(true);
  }, []);
  return (
    <>
      <Modal
        // className={styles['map__modal']}
        visible={mapVisible}
        onClose={handleBackBtn}
      >
        <div className={styles['modal']}>
          {location?.lat && location?.long && !showAllPlaces ? (
            <div style={{ width: '100%', height: '100%' }} className={styles['map']}>
              <DynamicMap
                className="rounded-1"
                center={[location.lat, location.long]}
                markers={[{ marker: [location.lat, location.long] }]}
              />
            </div>
          ) : null}
          {showAllPlaces && (
            <ImportantPlaces
              showPlacesOnMap={showPlacesOnMap}
              places={places}
              icon={icon}
              containerStyles={{
                position: 'absolute',
                height: '100%',
                backgroundColor: 'white',
                zIndex: 1000,
                right: 0,
                top: 0,
                borderRadius: '2px',
                padding: '24px',
              }}
            />
          )}
        </div>
      </Modal>
      <div className="text-end mb-1 text-black color-black text-weight-500 text-5">
        <span className="pe-1"> {title} </span>
      </div>
      <div className="d-flex flex-row-reverse align-items-center p-2 ">
        <span className="ps-2"> : آدرس</span>
        <span>{address}</span>
      </div>
      <div
        className={
          isMap
            ? ` w-75 d-flex justify-content-center align-items-cetner float-end gap-3 `
            : ` w-75 float-end`
        }
      >
        {places && places.length > 0 ? (
          <div className={isMap ? `w-100 ms-2` : 'w-100'}>
            <ImportantPlaces showPlacesOnMap={showPlacesOnMap} places={places} icon={icon} />
          </div>
        ) : null}
        <div className={isMap ? 'w-100 ms-2' : 'w-50'}>
          {location?.lat && location?.long ? (
            <div className={cn(styles['map'])}>
              <DynamicMap
                className="rounded-4"
                center={[location.lat, location.long]}
                markers={[{ marker: [location.lat, location.long] }]}
              />
              <div
                onClick={() => {
                  setMapVisible(true);
                }}
                className={styles['map__show']}
              ></div>
              <span
                onClick={() => {
                  setMapVisible(true);
                }}
                className={
                  places && places.length > 0
                    ? styles['map__show-text-withplaces']
                    : styles['map__show-text-withoutplases']
                }
              >
                مشاهده موقعیت هتل روی نقشه
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ImportantPlacesAndMap;
