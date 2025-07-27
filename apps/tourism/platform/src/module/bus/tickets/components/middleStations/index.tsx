import style from './style.module.scss';

interface Props {
  stations: { name?: string | undefined; distance?: string | undefined }[];
}
export const MiddleStations = ({ stations }: Props) => {
  return (
    <div className={style['stations']}>
      {stations.map((station, index) => {
        return (
          <div key={index.toString() + station?.name} className={style['station']}>
            <div className={style['name']}>{station.name}</div>
            <div className={style['icon']}></div>
            <div className={style['distance']}>{station.distance} کیلومتر </div>
          </div>
        );
      })}
    </div>
  );
};
