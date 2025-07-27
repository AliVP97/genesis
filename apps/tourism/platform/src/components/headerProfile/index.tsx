import { UserAccountIcon } from 'assets/icons';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { removeCookie } from 'utils/helpers/coockieHelper';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import styles from './headerProfile.module.scss';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { logout } from 'services/general/login';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { withScope, captureException } from '@sentry/nextjs';
import { AxiosError } from 'axios';
import { guestLogin } from 'utils/helpers/guestLogin';

type Props = {
  isProtected: boolean;
};

const HeaderProfile = ({ isProtected = false }: Props) => {
  const { login, setUserLogout, setLoginModalVisible } = useAuthContext();
  const userDropdownRef = useRef(null);
  const isOutside = useOutsideRef(userDropdownRef);
  const [open, setOpen] = useState(false);

  const { mutate: mutateLogout } = useMutation({
    mutationFn: async () => await logout(localStorage.getItem('UATP') as string),
    onSuccess: async () => {
      removeCookie('mobile');
      removeCookie('website');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('UATP');
        localStorage.removeItem('UFTP');
        localStorage.removeItem('ST');
      }
      setUserLogout(isProtected, !isProtected);
      guestLogin();
    },
    onError: (error: AxiosError) => {
      withScope(function (scope) {
        scope.setTag('tag', 'logout');
        scope.setLevel('error');
        captureException(`Logout failed ${error.message}`);
      });
    },
  });

  useEffect(() => {
    if (isOutside) setOpen(false);
  }, [isOutside]);

  const handleClick = () => {
    if (login) {
      mutateLogout();
    } else {
      setLoginModalVisible(true);
      setOpen(false);
    }
  };
  return (
    <button
      ref={userDropdownRef}
      onClick={() => setOpen(!open)}
      className={styles['headerProfile']}
    >
      <UserAccountIcon className="fill-primary" />
      {open && (
        <div
          className={cn(
            styles['headerProfile__dropdown'],
            open
              ? styles['headerProfile__dropdown--open']
              : styles['headerProfile__dropdown--close'],
          )}
        >
          {/* <div className={styles['headerProfile__dropdown__user']}></div>
        <Divider
          type="horizontal"
          className={styles['headerProfile__dropdown--divider']}
        /> */}
          <Link href="/profile/travels" passHref>
            <span className={styles['headerProfile__dropdown__action']}>مدیریت سفرها</span>
          </Link>
          <span onClick={handleClick} className={styles['headerProfile__dropdown__action']}>
            {login ? 'خروج از حساب کاربری' : 'ورود به حساب کاربری'}
          </span>
        </div>
      )}
    </button>
  );
};

export default HeaderProfile;
