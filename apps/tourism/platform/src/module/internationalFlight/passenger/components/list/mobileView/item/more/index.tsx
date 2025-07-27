import { DeleteIcon, EditIcon, MoreVerticalIcon } from 'assets/icons';
import { useEffect, useRef, useState } from 'react';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import styles from './more.module.scss';

type TMoreProps = {
  setRemoveModal: (e: boolean) => void;
  setEditModal: (e: boolean) => void;
};

const More = ({ setRemoveModal, setEditModal }: TMoreProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const outside = useOutsideRef(dropdownRef);

  const closeDropdown = () => {
    setOpen(false);
  };
  const openDropdown = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (outside) closeDropdown();
  }, [outside]);
  return (
    <>
      <span className={styles['passengerList__item--dropdown']}>
        <button
          onClick={() => {
            if (outside) closeDropdown();
            else openDropdown();
          }}
          className={styles['passengerList__item--btn']}
        >
          <MoreVerticalIcon />
        </button>
        {open && (
          <div ref={dropdownRef} className={styles['passengerList__item--dropdown-content']}>
            <div
              onClick={() => {
                closeDropdown();
                setRemoveModal(true);
              }}
            >
              حذف
              <DeleteIcon />
            </div>
            <div
              onClick={() => {
                closeDropdown();
                setEditModal(true);
              }}
            >
              ویرایش
              <EditIcon />
            </div>
          </div>
        )}
      </span>
    </>
  );
};

export default More;
