import { ReactNode } from 'react';
import style from './style.module.scss';

type TProps = {
  isOpen: boolean;
  children: ReactNode;
};

const Drawer = ({ isOpen, children }: TProps) => {
  return (
    <div className={`${style['main']} ${isOpen ? style['is-open'] : ''}`}>
      <div className={style['content']}>{children}</div>
    </div>
  );
};

export { Drawer };
