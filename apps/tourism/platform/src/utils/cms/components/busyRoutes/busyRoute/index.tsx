import classNames from 'classnames';
import Image from 'next/image';
import styles from '../style.module.scss';
import { ArrowLeftGreyIcon } from 'assets/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BusyRouteItemProps } from '../types';
import { BusyRoutesHandleClick } from 'utils/helpers/busyrouteLocalStorage';

function BusyRoute({ data }: { data: BusyRouteItemProps }) {
  const { pathname } = useRouter();
  return (
    <>
      <div>
        <div className={classNames(styles['busy-route__item'], 'card')}>
          {!!data?.image && (
            <Image
              className="card-img-top"
              src={data?.image?.url}
              alt="Card image cap"
              layout="responsive"
              objectFit="cover"
              width="195"
              height="112"
            />
          )}
          <div className="card-body text-center p-0">
            {data?.showLinks ? (
              <div onClick={(event) => BusyRoutesHandleClick(data, event, pathname)}>
                <Link href={data?.link || ''} passHref>
                  <div
                    rel="noreferrer"
                    className="d-flex justify-content-center cursor-pointer text-decoration-none color-on-surface"
                  >
                    <h6 className="card-title cursor-pointer">{data?.title}</h6>
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <h6 className="card-title">{data?.title}</h6>
                <div className="py-3">
                  {data?.links?.map((item) => {
                    return (
                      <div
                        onClick={(event) => BusyRoutesHandleClick(item, event, pathname)}
                        key={item.id}
                      >
                        <Link href={item.link || ''} passHref>
                          <div
                            rel="noreferrer"
                            className="d-flex justify-content-between p-3 py-2 align-items-center cursor-pointer text-decoration-none color-on-surface"
                          >
                            <span>{item.title}</span>
                            <ArrowLeftGreyIcon />
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BusyRoute;
