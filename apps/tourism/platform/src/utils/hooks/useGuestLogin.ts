import { useEffect, useState } from 'react';
import { getGuestToken } from 'services/general/login/guestLogin';
import { getCookie, removeCookie, setCookie } from 'utils/helpers/coockieHelper';

export const useGuestLogin = () => {
  const [guestIsLoggedIn, setGuestIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('UFTP') && localStorage.getItem('UATP')) {
      localStorage.removeItem('UATP');
      removeCookie('mobile');
    }

    if (!getCookie('guest_refresh_token') && !localStorage.getItem('UFTP')) {
      getGuestToken()
        .then((guestTokenData) => {
          setCookie(
            'guest_access_token',
            guestTokenData['access_token'],
            guestTokenData.access_expire_time,
          );
          setCookie(
            'guest_refresh_token',
            guestTokenData['refresh_token'],
            (new Date().getTime() + 34560000000) / 1000,
          );
          setGuestIsLoggedIn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else setGuestIsLoggedIn(true);
  }, []);

  return { guestIsLoggedIn };
};
