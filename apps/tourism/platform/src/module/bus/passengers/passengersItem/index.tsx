import { useEffect, useRef, Dispatch } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import dayjs from 'dayjs';

import { SelectInput } from 'components/selectInput';
import { TSelectInputType } from 'components/selectInput/types';

import { DATE_UTILS } from 'utils/helpers/dateUtils';
import useOutsideRef from 'utils/hooks/useOutsideRef';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { DeleteIcon, MoreVerticalIcon, EditIcon } from 'assets/icons';

import { TPassengerType } from 'services/general/passenger/interface';

import styles from 'module/flights/passengers/list/passengerList.module.scss';

interface PassengerProps {
  indexArr?: number;
  lengthArr?: number;
  passenger?: TPassengerType;
  selectPassenger?: (passenger: TPassengerType) => void;
  openModal?: (data: TPassengerType) => void;
  edit?: (data: TPassengerType) => void;
  open?: boolean;
  openDropdown?: (id: string) => void;
  closeDropdown?: () => void;
  checked?: boolean;
  editable?: boolean;
  setIsAdd?: Dispatch<boolean>;
  showCheckbox?: boolean;
  selectType?: TSelectInputType;
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
  selectType = 'checkBox',
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
    passportId,
    passportExpireDate,
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
            {!pathname.includes('travels') && <SelectInput type={selectType} checked={checked} />}{' '}
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
          key={id + 'passengersItem'}
          className={indexArr !== lengthArr! - 1 ? 'border-bottom border-color-blue-grey' : ''}
        >
          {showCheckbox && (
            <td
              className="d-flex justify-content-end"
              onClick={() => selectPassenger?.(passenger!)}
            >
              <SelectInput type={selectType} checked={checked} />
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
          <td className="text-center">{nationalId || '-'}</td>
          <td className="text-center">{passportId || '-'}</td>
          <td className="text-center text-start" dir="ltr">
            {!passportId ||
            passportExpireDate === '0001-01-01' ||
            !passportExpireDate ||
            passportExpireDate === '0'
              ? '-'
              : dayjs(Number(passportExpireDate) * 1000).format('YYYY MM DD') === '1 01 01'
                ? '-'
                : dayjs(Number(passportExpireDate) * 1000).format('YYYY MMM DD')}
          </td>
          <td className="text-center">
            {birthday === '1' || birthday === '0'
              ? '-'
              : passenger?.hijriBirthdayString?.split('-')[2] +
                DATE_UTILS.months.jalali[
                  Number(passenger?.hijriBirthdayString?.split('-')[1]) - 1
                ] +
                passenger?.hijriBirthdayString?.split('-')[0]}
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
