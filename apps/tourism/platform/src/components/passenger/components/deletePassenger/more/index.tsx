import { Delete, DeleteIcon, Edit, EditIcon, MoreVerticalIcon } from 'assets/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import styles from './more.module.scss';

import { MoreButtonContext } from '../../../context/MoreButtonContext';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
type More = {
  passengerId: string;
  passengerName: string;
};
const More = (props: More) => {
  const { passengerId, passengerName } = props;
  const [open, setOpen] = useState<boolean>(false);
  const { isMobile } = useDeviceDetect();
  const { setEditModal, setDeleteModal, setSelectedPassenger } =
    useContext<MoreButtonContext>(MoreButtonContext);
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
  const setModalData = () => {
    setSelectedPassenger && setSelectedPassenger({ id: passengerId, name: passengerName });
    closeDropdown();
  };
  return (
    <>
      <span className={styles['passengerList__item--dropdown']}>
        {isMobile ? (
          <button
            onClick={() => {
              if (outside) closeDropdown();
              else openDropdown();
            }}
            className={styles['passengerList__item--btn']}
          >
            <MoreVerticalIcon />
          </button>
        ) : null}
        {open && (
          <div ref={dropdownRef} className={styles['passengerList__item--dropdown-content']}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalData();
                setDeleteModal && setDeleteModal(true);
              }}
            >
              حذف
              <DeleteIcon />
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalData();
                setEditModal && setEditModal(true);
              }}
            >
              ویرایش
              <EditIcon />
            </div>
          </div>
        )}
        {!isMobile ? (
          <td>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalData();
                setDeleteModal && setDeleteModal(true);
              }}
            >
              <Delete />
            </span>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalData();
                setEditModal && setEditModal(true);
              }}
            >
              {' '}
              <Edit />
            </span>
          </td>
        ) : null}
      </span>
    </>
  );
};

export default More;
