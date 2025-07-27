import { ReactChild, useEffect, useState } from 'react';
import useCircleFill from './hook/ProfileCircleLoader';
import Image from 'next/image';
import { UserProfile } from 'assets/images';
import { useRouter } from 'next/router';
import { removeCookie } from 'utils/helpers/coockieHelper';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import style from './index.module.scss';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { LuggageIcon24px, PassengerIcon, ExitIcon, SupportIcon24px } from 'assets/icons';
import { useMutation } from 'react-query';
import { logout } from 'services/general/login';
import { withScope, captureException } from '@sentry/nextjs';
import { AxiosError } from 'axios';
import { guestLogin } from 'utils/helpers/guestLogin';

interface Props {
  children?: ReactChild;
}

export const ProfileLayout = ({ children }: Props) => {
  const { login } = useAuthContext();
  const { push } = useRouter();

  const currentFill = useCircleFill(100); // Use the custom hook

  const fillDegree = currentFill * 3.6; // Convert percentage to degrees
  const fillColor = '#1AA55B'; // Customize the fill color

  const { mutate: mutateLogout } = useMutation({
    mutationFn: async () => {
      await logout(localStorage.getItem('UATP') as string);
    },
    onSuccess: async () => {
      removeCookie('mobile');
      removeCookie('website');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('UATP');
        localStorage.removeItem('UFTP');
        localStorage.removeItem('ST');
      }
      guestLogin();
      push('/');
    },
    onError: (error: AxiosError) => {
      withScope(function (scope) {
        scope.setTag('tag', 'logout');
        scope.setLevel('error');
        captureException(`Logout failed ${error.message}`);
      });
    },
  });

  const authAction = () => {
    if (login) {
      mutateLogout();
    }
  };

  const [userPhoneNumber, setUserPhoneNumber] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const refToken = localStorage.getItem('UFTP');
      if (!refToken)
        push('/').catch(() => {
          throw new Error('try it again');
        });
    }
  }, []);

  useEffect(() => {
    if (login) {
      const access_token = localStorage.getItem('UATP');
      const decode: { mobile?: string } = access_token
        ? jwt_decode(access_token as string)
        : { mobile: '' };
      if (decode.mobile) {
        setUserPhoneNumber(decode.mobile);
      }
    }
  }, [login]);

  return (
    <div className={style.main}>
      <div className={style.sidebar}>
        <div className={style.user}>
          <div className={style.avatar}>
            <div className={style.container}>
              <div
                className={style.outerCircle}
                style={{
                  background: `conic-gradient(${fillColor} ${fillDegree}deg, transparent ${fillDegree}deg)`,
                }}
              >
                <div className={style.innerCircle}></div>
              </div>
            </div>
            <Image src={UserProfile} width="42" height="42" alt="780-user-logo" objectFit="cover" />
          </div>
          <div className={style.name}>نام کاربری</div>
          <div className={style.phone}>{userPhoneNumber}</div>
        </div>
        <div className={style.menu}>
          <Link href="/profile/travels">
            <a className={style.menuItem}>
              <LuggageIcon24px className={style.icon} />
              <span className={style.title}>مدیریت سفرها</span>
            </a>
          </Link>

          <Link href="/profile/passengers/v3">
            <a className={style.menuItem}>
              <PassengerIcon className={style.icon} />
              <span className={style.title}>لیست مسافران</span>
            </a>
          </Link>
        </div>
        <div className={style.menu}>
          <Link href="/profile/support">
            <a className={style.menuItem}>
              <SupportIcon24px className={style.icon} />
              <span className={style.title}>پشتیبانی</span>
            </a>
          </Link>
        </div>
        <div className={style.menu} onClick={authAction}>
          <span className={style.menuItem}>
            <ExitIcon className={style.icon} />
            <span className={style.title}>خروج از حساب کاربری</span>
          </span>
        </div>
      </div>
      <div className={style.mainContent}>{children}</div>
    </div>
  );
};
