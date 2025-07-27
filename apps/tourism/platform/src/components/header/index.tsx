import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Logo, ArrowDownIcon, DirectDownloadBlueIcon } from 'assets/icons';
import styles from './header.module.scss';
import { useRouter } from 'next/router';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import cn from 'classnames';
import useOutsideClick from 'utils/hooks/useOutsideClick';
import { throttle } from 'lodash';

const Header = () => {
  const { login, setLoginModalVisible } = useAuthContext();
  const [scrollY, setScrollY] = useState(0);
  const lastScrollYRef = useRef(0);
  const thresholdReachedRef = useRef(false);
  const { push } = useRouter();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const THRESHOLD = 100;

    if (currentScrollY <= THRESHOLD) {
      thresholdReachedRef.current = false;
      setScrollY(0);
    } else {
      thresholdReachedRef.current = true;
    }

    if (currentScrollY > lastScrollYRef.current && thresholdReachedRef.current) {
      setScrollY(100);
    } else if (currentScrollY < lastScrollYRef.current) {
      setScrollY(0);
    }

    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 300);
    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      throttledScroll.cancel();
    };
  }, [handleScroll]);

  const subMenuRef = useRef(null);

  const [activeMenuIndex, setActiveMenuIndex] = useState(-1);
  const handleHideSubMenu = () => {
    setActiveMenuIndex(-1);
  };
  useOutsideClick(subMenuRef, handleHideSubMenu);

  const baseURL = process.env.NEXT_PUBLIC_DOMAIN;

  return (
    <div className={styles.header} style={{ transform: `translateY(-${scrollY}%)` }}>
      <div className={styles.header__nav}>
        <div className="container-xxl d-flex justify-content-between">
          <div className={styles.header__nav__wrapper}>
            <Link href={`${baseURL}`}>
              <a>
                <Logo className={styles.header__logo} />
              </a>
            </Link>
            <ul ref={subMenuRef} className={cn(styles.header__nav__link, 'd-none d-md-flex mb-0')}>
              <li
                onClick={() => {
                  setActiveMenuIndex(0);
                }}
                className={`${styles['menu-item']} ${activeMenuIndex === 0 ? styles.active : ''}`}
              >
                <span>خدمات هف‌هشتاد</span>
                <ArrowDownIcon />
                <div className={styles.submenu}>
                  <div className={styles.section}>
                    <div className={styles.title}>خدمات مالی</div>
                    <ul>
                      <li>
                        <Link href={`${baseURL}finance/charge`}>خرید شارژ</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}finance/package`}>بسته اینترنت</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}finance/bill`}>پرداخت قبض</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}finance/balance`}>موجودی</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}finance/card-to-card`}>کارت به کارت</Link>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.section}>
                    <div className={styles.title}>خدمات گردشگری</div>
                    <ul>
                      <li>
                        <Link href="/flights">پرواز داخلی</Link>
                      </li>
                      <li>
                        <Link href="/international">پرواز خارجی</Link>
                      </li>
                      <li>
                        <Link href="/train">قطار</Link>
                      </li>
                      <li>
                        <Link href="/bus">اتوبوس</Link>
                      </li>
                      <li>
                        <Link href="/hotel">هتل</Link>
                      </li>
                      <li>
                        <Link href="/tour">تور داخلی - خارجی</Link>
                      </li>
                      <li>
                        <Link href="/visa">درخواست ویزا</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}safarcard`}>سفرکارت</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li
                onClick={() => {
                  setActiveMenuIndex(1);
                }}
                className={`${styles['menu-item']} ${activeMenuIndex === 1 ? styles.active : ''}`}
              >
                <span>باشگاه هف‌هشتادیا </span>
                <ArrowDownIcon />
                <div className={styles.submenu}>
                  <div className={styles.section} style={{ border: 'none' }}>
                    <ul>
                      <li>
                        <Link href={`${baseURL}780-club/lottery`}>قرعه کشی</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}780-club/chances`}>شانس ها</Link>
                      </li>
                      <li>
                        <Link href={`${baseURL}780-club/vote`}>رای گیری</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li
                onClick={() => {
                  setActiveMenuIndex(2);
                }}
                className={`${styles['menu-item']} ${activeMenuIndex === 2 ? styles.active : ''}`}
              >
                <a href={`${process.env.NEXT_PUBLIC_DOMAIN_URL}mag/`}>مجله هف‌هشتاد</a>
              </li>
              <li
                onClick={() => {
                  setActiveMenuIndex(3);
                }}
                className={`${styles['menu-item']} ${activeMenuIndex === 3 ? styles.active : ''}`}
              >
                <a
                  onClick={() =>
                    (location.href = `${process.env.NEXT_PUBLIC_DOMAIN_URL}mag/multimedia/`)
                  }
                >
                  چند رسانه هف‌هشتاد
                </a>
              </li>
            </ul>
          </div>
          <div className="d-flex">
            <button
              className={login ? styles['header__logged-in__btn'] : styles.header__btn}
              onClick={() => (!login ? setLoginModalVisible(true) : push('/profile/travels'))}
            >
              {login ? 'حساب کاربری' : 'ورود/ ثبت نام'}
            </button>
            <button
              className={styles['header__btn--download']}
              onClick={() => window.open('https://public.780.ir/dl/hafhashtad.apk', '_blank')}
            >
              <div className="ms-1">
                <DirectDownloadBlueIcon />
              </div>
              <span>دانلود اپلیکیشن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
