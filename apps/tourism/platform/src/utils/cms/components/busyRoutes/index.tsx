import BusyRoute from './busyRoute';
import styles from './style.module.scss';
import { BusyRoutesProps } from './types';

const BusyRoutes = ({ title, items }: BusyRoutesProps) => {
  return (
    <div dir="rtl" className="my-4">
      <div className={styles['busy-route']}>
        <h3 className="mb-2 fs-5">{title}</h3>
        <div className="row mx-md-5">
          {items?.map((item, index) => (
            <div className="col" key={index.toString() + item.title}>
              <BusyRoute data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusyRoutes;
