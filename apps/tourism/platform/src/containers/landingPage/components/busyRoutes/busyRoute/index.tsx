import classNames from 'classnames';
import { IBusyRoute } from 'containers/landingPage/types';
import Image from 'next/image';
import styles from '../busyRoutes.module.scss';
import { ArrowLeftGreyIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import { BusyRoutesHandleClick } from 'utils/helpers/busyrouteLocalStorage';
import Link from 'next/link';

type BusyRouteBoxPropsType = {
  busyRoute: IBusyRoute;
};

function BusyRoute({ busyRoute }: BusyRouteBoxPropsType) {
  const { pathname } = useRouter();

  return (
    <>
      <div>
        <div className={classNames(styles['busy-route__item'], 'card')}>
          {!!busyRoute.src && (
            <Image
              className="card-img-top"
              src={busyRoute.src}
              alt="Card image cap"
              layout="responsive"
              objectFit="cover"
              width=""
            />
          )}
          <div className="card-body text-center p-0">
            {pathname.includes('international') ? (
              <>
                {busyRoute?.routes.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={(event) => BusyRoutesHandleClick(item, event, pathname)}
                    >
                      <Link href={item.href || ''}>
                        <a
                          rel="noreferrer"
                          className="d-flex justify-content-center cursor-pointer text-decoration-none color-black"
                        >
                          <h6 className="card-title cursor-pointer">{busyRoute.title}</h6>
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <h6 className="card-title">{busyRoute.title}</h6>
                {busyRoute?.routes.length != 0 && (
                  <div className="py-3">
                    {busyRoute?.routes?.map((item) => {
                      return (
                        <div
                          onClick={(event) => BusyRoutesHandleClick(item, event, pathname)}
                          key={item.id}
                        >
                          {!item.hide && (
                            <Link href={item.href || ''}>
                              <a
                                rel="noreferrer"
                                className="d-flex justify-content-between p-3 py-2 align-items-center cursor-pointer text-decoration-none color-black"
                              >
                                <span>{item.title}</span>
                                <ArrowLeftGreyIcon />
                              </a>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BusyRoute;
