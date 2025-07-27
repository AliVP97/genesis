import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import styles from './bottomshet.module.scss';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import cn from 'classnames';
interface Props {
  children: React.ReactNode;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}
const Bottomshet = ({ children, setVisible, className }: Props) => {
  const contentRef = useRef(null);
  const outside = useOutsideRef(contentRef);
  useEffect(() => {
    if (outside) {
      setVisible?.(false);
    }
  }, [outside]);
  return (
    <div className={cn(styles['modal__container'], className)}>
      <div
        onClick={(e) => e.stopPropagation()}
        ref={contentRef}
        className={cn(styles['modal__content'])}
      >
        {children}
      </div>
    </div>
  );
};

export default Bottomshet;
