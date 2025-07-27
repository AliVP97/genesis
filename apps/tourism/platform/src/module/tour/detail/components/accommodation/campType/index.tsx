import { TTourPDPAccommodation } from 'services/tour/v2/detail/types';
import Button from 'components/button';
import React, { useState } from 'react';
import cn from 'classnames';
import { ArrowDownIcon } from 'assets/icons';
import router, { useRouter } from 'next/router';

const CampAccommodation = ({
  accommodationData,
  isMobile,
}: {
  accommodationData: TTourPDPAccommodation;
  isMobile: boolean | undefined;
}) => {
  const { query } = useRouter();

  const [showAll, setShowAll] = useState(false);

  const itemsToShow = showAll ? accommodationData?.data : accommodationData?.data?.slice(0, 4);

  const isShowAllCamp = accommodationData?.data && accommodationData?.data?.length > 4 && !showAll;

  const handleGoToCheckOut = (packageDateId: string) => {
    router.push(
      `/tour/checkout/${packageDateId}${query?.requestId ? `?requestId=${query?.requestId}` : ''}`,
    );
  };
  return (
    <div>
      {itemsToShow?.map((item, index) => {
        return (
          <div className="card mb-3" key={index}>
            <div className="row p-3 d-flex justify-content-between">
              <div className="col-lg-6 d-flex align-items-center text-weight-700 fs-4">
                <div>{item?.name}</div>
              </div>
              <div className="col-lg-6">
                <div
                  className={cn(
                    'd-flex flex-row',
                    isMobile ? 'justify-content-between pt-2' : 'justify-content-end',
                  )}
                >
                  <div>
                    <div className="color-on-surface-var text-weight-500">
                      {item?.pricing?.[0]?.title}
                    </div>
                    <div>
                      <span className="color-on-background">
                        {item?.pricing?.[0]?.price
                          ? Number(item?.pricing?.[0]?.price).toLocaleString()
                          : 0}
                      </span>
                      <small> ریال</small>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleGoToCheckOut(item?.packageDateId as string)}
                    className="btn btn-primary me-3 px-4 rounded-5"
                  >
                    انتخاب
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {isShowAllCamp && (
        <div className="text-center mt-3">
          <div onClick={() => setShowAll(!showAll)}>
            <div className="p-3 d-flex flex-row justify-content-center align-items-center">
              <div className="color-primary">مشاهده همه اقامتگاه</div>
              <ArrowDownIcon fill="#105FAE" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampAccommodation;
