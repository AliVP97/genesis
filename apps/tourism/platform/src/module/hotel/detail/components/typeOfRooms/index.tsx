import cn from 'classnames';
import styles from 'module/hotel/detail/details.module.scss';
import { ArrowLeftGreyIcon } from 'assets/icons';
import React from 'react';
import { TRoomDetails } from 'services/hotel/detail/interface';
import { isObjectNotEmpty } from 'utils/helpers/checkEmptyValue';

interface IProps {
  memoizedNewArray: Array<{
    id: number;
    isSelected: boolean;
    selectedRoom?: TRoomDetails;
    person: { adult: string; child: Array<{ value: 'string' }> };
    sumPrice: number;
  }>;
  handleItemClick: (index: number) => void;
  newArray: Array<{
    id: number;
    isSelected: boolean;
    selectedRoom?: TRoomDetails;
    person: { adult: string; child: Array<{ value: 'string' }> };
    sumPrice: number;
  }>;
  numberToPersianWorld: (index: number) => string | undefined;
}

export const TypeOfRooms = (props: IProps) => {
  const { memoizedNewArray, handleItemClick, newArray, numberToPersianWorld } = props;
  return (
    <div className="col p-0">
      <div className="bg-light card  d-flex flex-column justify-content-start align-items-end">
        <div
          className={cn(
            styles['rooms__titleSelectRooms'],
            'pb-3 text-4 p-4 text-weight-700 d-flex justify-content-end align-items-start',
          )}
        >
          انتخاب نوع اتاق ها
        </div>
        {memoizedNewArray.map((value, index: number) => {
          return (
            <div
              onClick={() => handleItemClick(index)}
              key={index.toString() + value.id.toString() + ' hotel'}
              className={cn(
                index == newArray.length - 1 && styles[`rooms__selectRooms__lastItem`],
                styles[`rooms__selectRooms`],
                value?.isSelected && styles[`rooms__selectRooms__activeRoom`],
                'p-4 w-100 d-flex justify-content-between flex-column cursor-pointer',
              )}
            >
              <div
                className={cn(
                  value.isSelected && styles[`rooms__selectRooms__activeBorder`],
                  !value?.selectedRoom?.roomInfo?.name &&
                    'd-flex justify-content-center align-items-center flex-row',
                )}
              >
                <div className="d-flex w-100 justify-content-between flex-row align-items-center">
                  <div>
                    <ArrowLeftGreyIcon style={{ transform: 'scale(1)' }} />
                  </div>
                  <div
                    style={{ direction: 'rtl' }}
                    className={cn(
                      value.isSelected && !value?.selectedRoom?.roomInfo?.name
                        ? 'color-primary text-3 text-weight-700 '
                        : 'color-grey-24 text-2 text-weight-400 ',
                      'px-2',
                    )}
                  >
                    {isObjectNotEmpty(value.selectedRoom) ? '' : 'انتخاب '}
                    {numberToPersianWorld(index)} ({` ${value?.person.adult} بزرگسال`}
                    {value?.person.child.length > 0 && (
                      <span>{` و ${value?.person.child.length}  کودک `}</span>
                    )}
                    )
                  </div>
                </div>
                {value?.selectedRoom?.roomInfo?.name && (
                  <div
                    className={cn(
                      value.isSelected && !value?.selectedRoom?.roomInfo?.name
                        ? 'color-primary text-4 text-weight-700'
                        : 'color-black text-3 text-weight-500 ',
                      'd-flex rtl pt-1 px-2',
                    )}
                  >
                    {value?.selectedRoom?.roomInfo?.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
