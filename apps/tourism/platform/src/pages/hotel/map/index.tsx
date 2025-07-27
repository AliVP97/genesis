import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styles from './map.module.scss';
const Map = dynamic(() => import('components/map'), {
  ssr: false,
});
const HotelMap = () => {
  const { query } = useRouter();
  const { lat, lng } = query;
  return (
    <div className={styles['map']}>
      {lat && lng ? (
        <Map
          center={[Number(lat), Number(lng)]}
          markers={[{ marker: [Number(lat), Number(lng)] }]}
        />
      ) : null}
    </div>
  );
};

export default HotelMap;
