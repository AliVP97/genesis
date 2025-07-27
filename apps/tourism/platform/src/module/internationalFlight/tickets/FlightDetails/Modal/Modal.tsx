import { FC } from 'react';
import styles from './Modal.module.scss';
import useModal from '../hooks/useModal';
import { createPortal } from 'react-dom';
import cn from 'classnames';

type ModalProps = {
  size?: 'large';
  className?: string;
  fullScreen?: boolean;
  backdropClassName?: string;
  onClose?: () => void;
};

const Modal: FC<ModalProps> = ({
  children,
  size,
  fullScreen,
  className,
  backdropClassName,
  onClose,
}) => {
  const { handleClose } = useModal(onClose);

  return createPortal(
    <>
      <div className={cn(styles['modal-backdrop'], backdropClassName)} onClick={handleClose}></div>
      <div
        className={cn(
          styles.modal,
          fullScreen && styles['full-screen'],
          size === 'large' && styles['large-size'],
          className,
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  );
};

export default Modal;
