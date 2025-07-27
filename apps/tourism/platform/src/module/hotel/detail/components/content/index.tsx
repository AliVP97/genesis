import { THotelDetails } from 'services/hotel/prepare/interface';
import Facilities from './components/facility';
import HotelInfoBox from './components/infoBox';
import { Cancel, Hotel, HotelRulesIcon, Location } from 'assets/icons';
import ImportantPlaces from './components/importantPlaces';
import SimilarHotels from './components/similarHotels';
import CancelationInfoBox from './components/cancelation';
import { useQuery } from 'react-query';
import { getSimilarHotels } from 'services/hotel/detail/similar';
import { useRouter } from 'next/router';
import Review from 'module/hotel/comment/review';

interface IContentProps {
  details: THotelDetails;
}
const Content = ({ details }: IContentProps) => {
  const { query } = useRouter();
  const { data: similarHotels, isLoading: similarHotelIsLoading } = useQuery(
    ['similarHotels', query?.hotelId as string, query.id as string],
    () => {
      return getSimilarHotels({
        hotelId: query?.hotelId as string,
        requestId: query.id as string,
      });
    },
  );
  return (
    <>
      <div className="px-1">
        <Facilities facilities={details?.facility || []} />
      </div>
      <hr />
      <div className="px-1">
        <HotelInfoBox
          icon={<HotelRulesIcon />}
          text={details?.about?.generalRules}
          title="قوانین و مقررات"
        />
      </div>
      <hr />
      <div>
        <div className="px-1">
          {details?.about?.cancellationRules ? (
            <CancelationInfoBox
              icon={<Cancel />}
              cancelationRules={details?.about?.cancellationRules}
              title="قوانین کنسلی"
            />
          ) : null}
          <hr />
        </div>
        <ImportantPlaces
          places={details?.sightLocation?.map((item) => {
            return {
              name: item?.name,
              time: item?.time,
              distance: item?.distance,
            };
          })}
          icon={<Location />}
          address={details?.address}
          location={details?.location?.point}
        />
      </div>
      <hr />
      <div className="px-1 pt-3">
        <HotelInfoBox icon={<Hotel />} text={details?.about?.aboutHotel} title="درباره هتل" />
      </div>
      <hr />
      {details?.reviews && details?.reviews?.totalRate && details?.reviews?.totalRate > 0 ? (
        <div style={{ paddingBottom: '126px' }} className="px-1 pt-3">
          <Review hotelName={details?.name} data={details?.reviews} />
        </div>
      ) : null}

      {similarHotels?.list && (
        <SimilarHotels
          data={similarHotels}
          isLoading={similarHotelIsLoading}
          title={'هتل های مشابه'}
        />
      )}
    </>
  );
};

export default Content;
