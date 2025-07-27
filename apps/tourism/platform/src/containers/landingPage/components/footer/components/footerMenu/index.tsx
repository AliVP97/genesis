import { IFooterMenu } from 'layout/landingLayout/intreface';
import styles from './footerMenu.module.scss';
import cn from 'classnames';
import React from 'react';
import Link from 'next/link';

type FooterMenuProps = {
  menu: IFooterMenu;
};
const FooterMenu = ({ menu }: FooterMenuProps) => {
  return (
    <>
      <div>
        <div className={cn(styles['footer-menu'], 'text-right')}>
          <div className={cn(styles['footer-menu__header'], 'pb-2 mb-2 ms-4')}>
            <span className="text-white"> {menu.title}</span>
          </div>
          <div className="text-white font-weights font-sizes-2">
            {React.Children.toArray(
              menu.subMenu.map((item) => {
                return (
                  <div
                    key={item.link}
                    className="text-end my-2 text-white font-weights font-sizes-2"
                  >
                    <Link href={item.link}>{item.title}</Link>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterMenu;
