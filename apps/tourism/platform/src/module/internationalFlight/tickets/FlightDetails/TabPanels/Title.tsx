import classNames from 'classnames';
import styles from './Title.module.scss';
import { useMemo } from 'react';
import useFlight from './hooks/useFlight';
import formatIataCityRoute from './utils/formatIataCityRoute';

const Title = () => {
  const { dictionary, flight } = useFlight();
  const { title } = useMemo(
    () => ({
      title: formatIataCityRoute(flight, dictionary),
    }),
    [dictionary, flight],
  );

  return <div className={classNames('fw-500', styles['title'])}>{title}</div>;
};

export default Title;
