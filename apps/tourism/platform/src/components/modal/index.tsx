import { ReactNode, Dispatch, SetStateAction, useState, useEffect } from 'react';
import Backdrop from './backdrop';
import styles from './modal.module.scss';
import cn from 'classnames';
import Portal from './Portal';
import Bottomshet from './bottomshet';
interface Props {
  children: ReactNode;
  visible: boolean;
  className?: string;
  bottomSheet?: boolean;
  onClose?: () => void;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  backdropDisable?: boolean;
  bottomSheetStyles?: string;
  transition?: boolean;
}

const Modal = ({
  children,
  visible,
  onClose,
  setVisible,
  className,
  bottomSheet = false,
  backdropDisable = false,
  bottomSheetStyles,
  transition = false,
}: Props) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      if (transition) {
        requestAnimationFrame(() => setAnimationClass(styles.show));
      } else setAnimationClass(styles.show);
    } else {
      setAnimationClass(styles.hide);
      const timeout = setTimeout(() => setShouldRender(false), transition ? 300 : 0);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <Portal visible={shouldRender}>
      {bottomSheet ? (
        <Bottomshet className={bottomSheetStyles} setVisible={setVisible}>
          {children}
        </Bottomshet>
      ) : (
        <div className={cn(styles.modal__container, animationClass, className)}>
          {children}
          <Backdrop disable={backdropDisable} closeModal={onClose} />
        </div>
      )}
    </Portal>
  );
};

export default Modal;
