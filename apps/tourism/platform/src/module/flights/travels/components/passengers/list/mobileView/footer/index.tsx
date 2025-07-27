import React, { ButtonHTMLAttributes } from 'react';
import styles from './footer.module.scss';

interface IFooterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const Footer = ({ children, ...props }: IFooterProps) => {
  return (
    <>
      <div className={styles['footer']}>
        <button {...props}>{children}</button>
      </div>
    </>
  );
};

export default Footer;
