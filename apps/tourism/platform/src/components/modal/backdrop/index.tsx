import styles from '../modal.module.scss';

const Backdrop = ({ closeModal, disable }: { closeModal?: () => void; disable: boolean }) => {
  return (
    <div
      style={disable ? { pointerEvents: 'none' } : {}}
      onClick={closeModal}
      onTouchEnd={closeModal}
      className={styles['portal__mask']}
    />
  );
};

export default Backdrop;
