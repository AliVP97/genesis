import React, { useEffect, useRef, useState } from 'react';
import { Airport } from './interface';
import { useSpring, animated } from 'react-spring';
import styles from './selectOriginAndDestination.module.scss';
import { PlaceIcon, DomesticFlightIcon, ArrowUpIcon, ArrowDownIcon } from 'assets/icons';
import cn from 'classnames';

interface StationsProps {
  country: { country_name: string; country_name_fa: string };
  city: { city_name: string; city_name_fa: string };
  stations: Airport[];
  setLocation: (
    // name: 'origin' | 'destination',
    station: Airport,
    country: { country_name: string; country_name_fa: string },
    city: { city_name: string; city_name_fa: string },
  ) => void;
  type?: 'busy' | 'history';
}

const Stations: React.FC<StationsProps> = ({ country, city, stations, setLocation }) => {
  const ref = useRef<HTMLDivElement>(null);
  5;
  const [open, setOpen] = useState(false);
  const [style, animate] = useSpring(() => ({ height: '0px' }), []);

  useEffect(() => {
    if (!ref.current) return;
    animate({
      height: (open ? ref.current.offsetHeight : 0) + 'px',
    });
  }, [animate, ref, open]);

  return stations.length > 1 ? (
    <div className={styles.airportList}>
      <div
        className={cn(styles['airportList__header'], open && styles['airportList__header--border'])}
      >
        <PlaceIcon />
        <div className="d-flex flex-column">
          <span className="text-weight-bold">{city.city_name_fa}</span>
          <span className="color-grey-1 text-4">{country.country_name_fa}</span>
        </div>
        <span
          className={cn(styles['airportList__header--toggler'], 'me-auto')}
          onClick={() => setOpen((prev) => !prev)}
        >
          {stations.length} فرودگاه {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </span>
      </div>
      <animated.div style={{ overflow: 'hidden', width: '100%', ...style }}>
        <div ref={ref}>
          <div className={cn(styles['airportList__airport'])}>
            <DomesticFlightIcon />
            <span className="ms-3">همه فرودگاه ها</span>
          </div>
          {stations.map((station: Airport) => (
            <div
              key={station.iata}
              className={cn(styles['airportList__airport'])}
              onClick={() => setLocation(station, country, city)}
            >
              <DomesticFlightIcon />
              <span className="text-weight-bold">{station.airport_name_fa}</span>
              <span className="me-auto">{station.iata}</span>
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  ) : (
    <div
      key={stations[0].iata}
      className={cn(styles['airportList__airport'])}
      onClick={() => setLocation(stations[0], country, city)}
    >
      <DomesticFlightIcon />
      <div className="d-flex flex-column w-100">
        <div className="d-flex w-100">
          <span className="text-weight-bold">{stations[0].airport_name_fa}</span>
          <span className="me-auto ms-3">{stations[0].iata}</span>
        </div>
        <span className="mt-2">
          {city.city_name_fa}, {country.country_name_fa}
        </span>
      </div>
    </div>
  );
};

export default Stations;
