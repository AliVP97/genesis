import { useRouter } from 'next/router';
import Image from 'next/image';
import { ArrowLeftGreyIcon } from 'assets/icons';
import styles from '../tourListContainer.module.scss';
import cn from 'classnames';
// import {TourTrackingEvent} from 'utils/ecommerce/application/mappers/tour/events';
import { TtourList } from 'services/tour/register/interface';

const TourItemCard = ({ data }: { data: TtourList[] | undefined }) => {
  const { query, push } = useRouter();
  const tourType = query.type ? `/${query.type}` : '/domestic';
  // const tourTrackingEvent = new TourTrackingEvent();

  return (
    <div className={styles['card-container']}>
      {data?.map((item) => (
        <div key={item?.id}>
          <a
            rel="noreferrer"
            className={cn(styles['card-container'], 'cursor-pointer')}
            onClick={() => {
              // tourTrackingEvent.selectItem(item);
              push(`/tour${tourType}/${item?.id}`);
            }}
          >
            <span className={styles['card-container__card']}>
              {item?.badge && item.type === 'DOMESTIC' && (
                <span className={styles['card-container__card__badge']}>{item?.badge}</span>
              )}
              <Image
                className={styles['card-container__card__image']}
                src={item?.image as string}
                width={100}
                height={400}
                quality={100}
                alt={item?.title}
              />
              <span className={styles['card-container__card__title']}>{item?.title}</span>
              <span className={styles['card-container__card__description']}>
                <div className="d-flex flex-row">
                  <div className="ps-2">{item?.priceDescription}</div>
                  <div>
                    {Number(item?.basePrice)?.toLocaleString()} <span>ریال</span>
                  </div>
                </div>
              </span>
              <span className="d-flex align-items-center pt-3 pb-4 cursor-pointer text-decoration-none gap-2">
                <span className="color-primary fw-bold">بررسی جزئیات</span>
                <ArrowLeftGreyIcon className={styles['card-container__card__svg']} />
              </span>
            </span>
          </a>
        </div>
      ))}
    </div>
  );
};
export default TourItemCard;
