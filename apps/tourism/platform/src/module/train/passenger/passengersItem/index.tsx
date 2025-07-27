import styles from 'module/flights/passengers/list/passengerList.module.scss';
import Checkbox from 'components/checkbox';
import { DeleteIcon, MoreVerticalIcon, EditIcon } from 'assets/icons';
import { useEffect, useRef } from 'react';
import cn from 'classnames';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import dayjs from 'dayjs';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { Dispatch } from 'react';
import { PassengerPayload } from 'services/general/passenger/interface';
import { useRouter } from 'next/router';

interface PassengerProps {
  indexArr?: number;
  lengthArr?: number;
  passenger?: PassengerPayload['body'];
  selectPassenger?: (passenger: PassengerPayload['body']) => void;
  openModal?: (data: PassengerPayload['body']) => void;
  edit?: (data: PassengerPayload['body']) => void;
  open?: boolean;
  openDropdown?: (id: string) => void;
  closeDropdown?: () => void;
  checked?: boolean;
  editable?: boolean;
  setIsAdd?: Dispatch<boolean>;
  showCheckbox?: boolean;
}

const PassengersItem = ({
  indexArr,
  lengthArr,
  passenger,
  selectPassenger,
  openModal,
  edit,
  open,
  openDropdown,
  closeDropdown,
  checked,
  editable,
  setIsAdd,
  showCheckbox = true,
}: PassengerProps) => {
  const dropdownRef = useRef(null);
  const outside = useOutsideRef(dropdownRef);
  useEffect(() => {
    if (outside) closeDropdown?.();
  }, [outside]);
  const {
    persianName,
    persianFamily,
    englishName,
    englishFamily,

    id,
    nationalId,
    birthday,
    gender,
  } = passenger!;
  const { isMobile } = useDeviceDetect();
  const { pathname } = useRouter();

  return (
    <>
      {isMobile ? (
        <div className={styles['passengerList__item']}>
          <div onClick={() => selectPassenger?.(passenger!)} className="d-flex align-items-center">
            {!pathname.includes('travels') && <Checkbox checked={checked} />}{' '}
            <div
              className={cn(
                styles['passengerList__item--title'],
                'pe-2 text-weight-500 color-black',
                persianName && persianFamily ? 'rtl' : 'ltr',
              )}
            >
              {persianName && persianFamily
                ? persianName + ' ' + persianFamily
                : englishName + ' ' + englishFamily}
            </div>
          </div>
          <div className="color-grey-1 text-3">
            {editable && (
              <span className={styles['passengerList__item--dropdown']}>
                <button
                  onClick={() => {
                    if (outside) closeDropdown?.();
                    else openDropdown?.(id!);
                  }}
                  className={styles['passengerList__item--btn']}
                >
                  <MoreVerticalIcon />
                </button>
                {open && (
                  <div
                    ref={dropdownRef}
                    className={styles['passengerList__item--dropdown-content']}
                  >
                    <div
                      onClick={() => {
                        edit?.(passenger!);
                        closeDropdown?.();
                      }}
                    >
                      <EditIcon />
                      ویرایش
                    </div>
                    <div
                      onClick={() => {
                        openModal?.(passenger!);
                        closeDropdown?.();
                      }}
                    >
                      <DeleteIcon />
                      حذف
                    </div>
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
      ) : (
        <tr
          key={id}
          className={indexArr !== lengthArr! - 1 ? 'border-bottom border-color-blue-grey' : ''}
        >
          {showCheckbox && (
            <td>
              <div onClick={() => selectPassenger?.(passenger!)}>
                <Checkbox checked={checked} />
              </div>
            </td>
          )}
          <td className="text-center">
            <div className="text-weight-3">
              <span>
                {englishName} {englishFamily}
              </span>
            </div>
            <div className="text-3 color-grey-1">
              <span>
                {persianName} {persianFamily}
              </span>
            </div>
          </td>
          <td className="text-center">
            <span>{gender === 'GENDER_TYPE_MALE' ? 'آقا' : 'خانم'}</span>
          </td>
          <td className="text-center">{nationalId}</td>
          <td className="text-center">
            {dayjs(birthday, { jalali: false }).calendar('jalali').format('YYYY/MM/DD')}
          </td>
          <td className="text-start d-flex flex-row">
            <div
              onClick={() => {
                edit?.(passenger!);
                if (setIsAdd) {
                  setIsAdd(false);
                }
              }}
            >
              <EditIcon className="mx-3" />
            </div>
            <div
              onClick={() => {
                openModal?.(passenger!);
                if (setIsAdd) {
                  setIsAdd(false);
                }
              }}
            >
              <DeleteIcon />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

PassengersItem.defaultProps = {
  editable: true,
};

export default PassengersItem;
