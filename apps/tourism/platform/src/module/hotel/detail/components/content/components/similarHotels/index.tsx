import HotelItem from 'module/hotel/cardView/components/hotelItem';
import { useRouter } from 'next/router';
import styles from './SimilarHotels.module.scss';
import Spinner from 'components/spinner';
import { THotelSimilars } from 'services/hotel/detail/interface';
interface TSimilarHotelsProps {
  title?: string;
  titleStyle?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  similarHotelsRef?: React.LegacyRef<HTMLDivElement>;
  data: THotelSimilars;
  isLoading: boolean;
}
const SimilarHotels = ({
  title,
  containerStyles,
  titleStyle,
  similarHotelsRef,
  data,
  isLoading,
}: TSimilarHotelsProps) => {
  const { query } = useRouter();
  const router = useRouter();
  const handleClick = (hotelId: string): void => {
    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        hotelId: hotelId,
      },
    });
  };

  return (
    <div className="rtl">
      {data?.list && data?.list?.length > 1 ? (
        <h6 style={{ ...titleStyle }} className="text-end mb-3">
          <span className="pe-1"> {title} </span>
        </h6>
      ) : null}

      <div ref={similarHotelsRef} className={styles['cards']}>
        {isLoading ? <Spinner /> : null}
        {data?.list?.map((hotel, idx) => (
          <div
            role="button"
            onClick={() => {
              handleClick(hotel.hotelId as string);
            }}
            key={idx.toString() + 'hotelSimilarHotel'}
            className={styles['cards__item']}
          >
            <HotelItem
              uuid={hotel?.uniqueId || ''}
              info={hotel}
              key={hotel.hotelId + 'similarHotel'}
              isMobile={true}
              requestId={query.id as string}
              containerStyles={{ ...containerStyles }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarHotels;
