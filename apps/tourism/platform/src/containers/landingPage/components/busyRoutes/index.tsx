import { IBusyRoute } from 'containers/landingPage/types';
import BusyRoute from './busyRoute';
import styles from './busyRoutes.module.scss';
type BusyRoutesProps = {
  title: string;
  routes: Array<IBusyRoute>;
};

function BusyRoutes({ routes, title }: BusyRoutesProps) {
  return (
    <>
      <div className={styles['busy-route']}>
        <h3 className="mb-2 fs-5">{title}</h3>
        <div className="row mx-md-5">
          {routes.map((item, index) => (
            <div className="col" key={index.toString() + item.title}>
              <BusyRoute busyRoute={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default BusyRoutes;
