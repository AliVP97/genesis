import { ArrowLeftPrimaryColor } from 'assets/icons';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { THotelDetailsFacilities } from 'services/hotel/prepare/interface';

export type TFacilitiesProps = {
  facilities: THotelDetailsFacilities;
};

const Facilities = ({ facilities }: TFacilitiesProps) => {
  const [show, setShow] = useState<boolean>(false);
  const groupArrayElements = useMemo(() => {
    const groupedArray = [];
    for (let i = 0; i < facilities.length; i += 2) {
      groupedArray.push(facilities.slice(i, i + 2));
    }
    return groupedArray;
  }, [facilities]);

  return (
    <>
      <div className="mt-4">
        <h6 className="text-end mb-3">امکانات هتل</h6>
        <div className="row">
          {facilities &&
            facilities?.slice(0, 4).map((item, index) => (
              <div
                className="col-6 d-flex align-items-center justify-content-end"
                key={index.toString() + item?.name + 'hotelFacility'}
              >
                <span className="text-end pe-2">{item?.name}</span>
                {item.icon && (
                  <Image
                    loader={() => item.icon || ''}
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                  />
                )}
              </div>
            ))}
        </div>
        <div className="mt-3" onClick={() => setShow(true)}>
          <ArrowLeftPrimaryColor />
          <span className="ps-3 color-primary">مشاهده امکانات</span>
        </div>
        <BottomSheet
          open={show}
          onDismiss={() => setShow(false)}
          skipInitialTransition
          snapPoints={({ maxHeight }) => maxHeight * 0.5}
        >
          <div className="d-flex flex-column px-4 pt-3">
            <h6 className="text-center pb-2">امکانات هتل</h6>
            {groupArrayElements?.map((item, idx) => {
              return (
                <div
                  className="d-flex flex-row-reverse align-items-center justify-content-between"
                  key={idx.toString() + 'hotelFacility'}
                >
                  <div className="d-flex align-items-center">
                    <div className="px-1">{item[0]?.name}</div>
                    {item[0]?.icon && (
                      <Image
                        loader={() => item[0].icon || ''}
                        src={item[0].icon}
                        alt={item[0].name}
                        width={24}
                        height={24}
                      />
                    )}
                  </div>
                  <div className="d-flex align-items-center w-50 justify-content-between">
                    <div style={{ marginLeft: 'auto' }} className="px-1">
                      {item[1]?.name || ''}
                    </div>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                      }}
                    >
                      {item[1]?.icon && (
                        <Image
                          loader={() => item[1].icon || ''}
                          src={item[1].icon}
                          alt={item[1].name}
                          width={24}
                          height={24}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BottomSheet>
      </div>
    </>
  );
};

export default Facilities;
