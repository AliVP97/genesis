import { useEffect } from 'react';
import router, { useRouter } from 'next/router';
import { setCookie } from 'utils/helpers/coockieHelper';
import style from './style.module.scss';
import Spinner from 'components/spinner';
import jwt_decode from 'jwt-decode';

const Connector = () => {
  const { query } = useRouter();

  useEffect(() => {
    if (query.platform === 'superapp') {
      // set platform
      sessionStorage.setItem('platform', 'superapp');

      // set auth
      setCookie(
        'mobile',
        (
          jwt_decode(localStorage.getItem('UATP') as string) as {
            mobile?: string;
          }
        ).mobile || '-',
        (new Date().getTime() + 7200000) / 1000,
      );
    }

    const serviceName = query.servicename;

    // redirect
    router.replace('/' + serviceName);
  });

  return (
    <div className={style['main']}>
      <Spinner />
    </div>
  );
};

export { Connector };
