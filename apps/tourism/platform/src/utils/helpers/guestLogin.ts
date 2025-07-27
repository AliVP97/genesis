import { getGuestToken } from 'services/general/login/guestLogin';
import { setCookie } from './coockieHelper';

const guestLogin = () => {
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
    })
    .catch((error) => {
      console.log(error);
    });
};
export { guestLogin };
