import { Car, ArrowLeftPrimaryColor, BackArrowIcon } from 'assets/icons';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import styles from './importantPlaces.module.scss';
import Modal from 'components/modal';
import { TImportantPlaces } from 'module/hotel/detail/components/importantPlacesAndMap';
interface TImportantPlacesProps extends TImportantPlaces {
  address?: string;
  location?: { lat?: number; long?: number };
}
const DynamicMap = dynamic(() => import('components/map'), {
  ssr: false,
});
const ImportantPlaces = ({ address, icon, places, location }: TImportantPlacesProps) => {
  const [show, setShow] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const handleBackBtn = () => {
    setMapVisible(false);
  };

  return (
    <div className="rtl">
      <h6 className="text-end mb-3">
        {icon}
        <span className="pe-1 ">موقعیت هتل و مکان های مهم اطراف هتل</span>
        <div className="d-flex jusity-content-between align-items-center pt-4 fs-2">
          <div className="ps-2">آدرس:</div>
          <div className="text-start">{address}</div>
        </div>{' '}
      </h6>
      <Modal visible={mapVisible} onClose={handleBackBtn}>
        <div className="bg-white w-100 h-100 overflow-hidden">
          <div className={styles['map__modal--header']}>
            <div />
            <div>موقعیت هتل روی نقشه</div>
            <div>
              <BackArrowIcon className="fill-tertiary" onClick={handleBackBtn} />
            </div>
          </div>
          {location?.lat && location?.long ? (
            <div className={styles['map__modal--map']}>
              <DynamicMap
                center={[location.lat, location.long]}
                markers={[{ marker: [location.lat, location.long] }]}
              />
            </div>
          ) : null}
        </div>
      </Modal>
      <div className="pt-2 pb-2">
        {location?.lat && location?.long ? (
          <div className={styles['map']}>
            <DynamicMap
              center={[location.lat, location.long]}
              markers={[{ marker: [location.lat, location.long] }]}
            />
            <div
              onClick={() => {
                setMapVisible(true);
              }}
              className={styles['map__show']}
            >
              <span className={styles['map__show--text']}>مشاهده موقعیت هتل روی نقشه</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="d-flex justify-content-center  flex-column my-3">
        {places?.slice(0, 3).map((item, idx) => {
          return (
            <div key={idx.toString() + item?.name}>
              <div className="d-flex gap-2 justify-content-between">
                <div>{`${item?.name} ${item?.distance} ${item?.time}`}</div>
                {places.length > 0 ? (
                  <>
                    <div>
                      <Car />
                    </div>
                  </>
                ) : null}
              </div>
              {idx !== 3 && <hr />}
            </div>
          );
        })}
      </div>
      {places && places?.length > 0 ? (
        <div
          className="mt-3 d-flex align-items-center justify-content-end"
          onClick={() => setShow(true)}
        >
          <span className="ps-3 color-primary">مشاهده همه مکان های نزدیک</span>
          <ArrowLeftPrimaryColor />
        </div>
      ) : null}
      <BottomSheet
        open={show}
        onDismiss={() => setShow(false)}
        skipInitialTransition
        snapPoints={({ maxHeight }) => maxHeight * 0.5}
      >
        <div className="px-2 pt-3 text-end px-4">
          <h6 className="text-center pb-2">موقعیت هتل و مکان های مهم اطراف هتل</h6>
          <div className="rtl">
            {places?.map((item, idx) => {
              return (
                <div key={idx.toString() + item?.distance + item?.name}>
                  <div className="d-flex gap-2 justify-content-between">
                    <div>{`${item?.name} ${item?.distance} ${item?.time}`}</div>
                    <div>
                      <Car />
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default ImportantPlaces;
