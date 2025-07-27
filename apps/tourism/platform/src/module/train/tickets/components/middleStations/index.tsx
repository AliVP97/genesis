import cn from 'classnames';
import Spinner from 'components/spinner';
import { useQuery } from 'react-query';
import { getMiddleStations } from 'services/train/tickets';
import { TrainMiddleStationsResponse } from 'services/train/tickets/interface';
import { TicketType } from '../../interface';
import EmptyMiddleStation from './emptyMiddleStation';
import style from './style.module.scss';

interface Props {
  isDesktop?: boolean;
  stations?: Required<TrainMiddleStationsResponse>;
  id?: string;
  selectedTicket: TicketType | null;
}
export const MiddleStations = ({ isDesktop, stations, id, selectedTicket }: Props) => {
  const { data: middleStations, isLoading } = useQuery(
    ['getMiddleStations', id as string],
    getMiddleStations,
    {
      enabled: !isDesktop,
    },
  );

  return isDesktop ? (
    <>
      {isLoading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div className={style['middle']}>
            <div className={cn(style['middle__rows'], 'col')}>
              <div className="col-2 my-2">ردیف </div>
              <div className="col-6 my-2"> ایستگاه</div>
              <div className="col-4 my-2"> زمان ورود به ایستگاه</div>
            </div>
            <div className={style['middle__divider']} />
            {!stations?.stations && (
              <>
                <EmptyMiddleStation selectedTicket={selectedTicket} />
              </>
            )}
            {stations?.stations?.map((item, index) => (
              <>
                <div
                  key={index.toString() + item?.name}
                  className={cn(style['middle__rows--stations'], 'col')}
                >
                  <div className="col-2 my-2"> {index + 1}</div>
                  <div
                    className={cn(
                      'col-6 my-2',
                      (index == 0 || index == stations.stations?.length - 1) &&
                        'color-primary text-weight-500',
                    )}
                  >
                    {item.name}
                  </div>
                  <div
                    className={cn(
                      'col-4 my-2',
                      (index == 0 || index == stations.stations?.length - 1) &&
                        'color-primary text-weight-500',
                    )}
                  >
                    {item.enterTime || '-'}
                  </div>
                </div>
                {index != stations.stations?.length - 1 && (
                  <div className={style['middle__divider--stations']} />
                )}
              </>
            ))}
          </div>
        </>
      )}
    </>
  ) : (
    <div className={cn(style['mobile-middle'], 'pt-4')}>
      {isLoading ? (
        <div className="my-3">
          <Spinner />
        </div>
      ) : (
        <>
          {middleStations?.stations && middleStations?.stations?.length > 0 ? (
            <>
              <div className="justify-content-center d-flex color-black text-5 text-weight-500 mb-2">
                <div>{middleStations?.stations?.[0].enterTime}</div>
                <div className="ms-2">{middleStations?.stations?.[0].name}</div>
              </div>
              <div className={cn(style['mobile-middle__timeline'], 'pt-4')}>
                <div className={style['mobile-middle__timeline__endpoints--first']} />
                <div className={style['mobile-middle__timeline__center-line']} />
                <div className={style['mobile-middle__timeline__content']}>
                  {middleStations?.stations?.map(
                    (item, index) =>
                      index != 0 &&
                      index !== Number(middleStations?.stations?.length) - 1 && (
                        <>
                          <div className={style['mobile-middle__timeline__item']}>
                            <div className={style['mobile-middle__timeline__left-container']}>
                              <div className={style['mobile-middle__timeline__content-left']}>
                                <p>{item.enterTime}</p>
                              </div>
                            </div>
                            <div className={style['mobile-middle__timeline__right-container']}>
                              <div className={style['mobile-middle__timeline__content-right']}>
                                <p>{item.name}</p>
                              </div>
                            </div>
                            <div className={style['mobile-middle__timeline__circle']} />
                          </div>
                        </>
                      ),
                  )}
                </div>
                <div className={style['mobile-middle__timeline__endpoints--last']} />
              </div>
              <div className="justify-content-center d-flex color-black text-weight-500 mt-2 text-5">
                <div>
                  {middleStations?.stations?.[middleStations.stations.length - 1].enterTime}
                </div>
                <div className="ms-2">
                  {middleStations?.stations?.[middleStations.stations.length - 1].name}
                </div>
              </div>
            </>
          ) : (
            <>
              <EmptyMiddleStation selectedTicket={selectedTicket} />
            </>
          )}
        </>
      )}
    </div>
  );
};
