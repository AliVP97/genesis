import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';

import More from '../deletePassenger/more';
import Checkbox from 'components/checkbox';
import { useContext, useMemo } from 'react';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { useQueryClient } from 'react-query';
import { AddPassengerResponse } from 'services/passenger/interface';
import styles from './passengerListDesktop.module.scss';
import { ServiceName } from '.';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';
type TPassengerItemProps = {
  passenger: PassengerModel;
  serviceName: ServiceName;
  handleSelected: () => void;
  refrenceDate?: string;
};

const PassengerItemDesktop = ({
  passenger,
  serviceName,
  handleSelected,
  refrenceDate,
}: TPassengerItemProps) => {
  const queryClient = useQueryClient();
  const cachedData: { passengers: AddPassengerResponse[] } | undefined = queryClient.getQueryData([
    'passengerList',
    serviceName,
    refrenceDate,
  ]);
  const pasengerName = passenger.persianName
    ? passenger.persianName + ' ' + passenger.persianFamily
    : passenger?.englishName + ' ' + passenger?.englishFamily;

  const { selectedPassengers, setEditModal, setSelectedPassenger, disabledPassengers } =
    useContext<MoreButtonContext>(MoreButtonContext);
  const selectable = serviceName !== 'passenger';
  const index = useMemo(() => {
    if (selectable) {
      return selectedPassengers?.findIndex((obj) => obj?.id === passenger?.id);
    }
  }, [selectedPassengers, passenger, serviceName]);

  const isNeedEdit = useMemo(() => {
    if (cachedData && selectable) {
      const passengers = cachedData?.passengers;

      for (const item of passengers) {
        if (item?.fields && item.id === passenger.id) {
          for (const field of item?.fields) {
            if (!field.isOptional && !field?.value) {
              return true;
            }
          }
          break;
        }
      }
    }
    return false;
  }, [passenger, cachedData, serviceName]);

  return (
    <>
      <tr style={selectable && index !== -1 && isNeedEdit ? { position: 'relative' } : undefined}>
        {selectable && index !== -1 && isNeedEdit && (
          <div className={styles['editText']}>
            اطلاعات این مسافر کامل نیست و نیاز به ویرایش دارد.
          </div>
        )}
        <td style={{ height: '56px', paddingRight: '12px' }} className="d-flex align-items-center">
          {selectable && (
            <div style={{ paddingRight: '10px' }} onClick={handleSelected}>
              <Checkbox
                disabled={disabledPassengers?.includes(passenger.id as string)}
                style={
                  index !== -1 && isNeedEdit
                    ? { background: '#BB1614', borderColor: '#BB1614' }
                    : undefined
                }
                checked={index === -1 ? false : true}
              />
            </div>
          )}
          <div>{pasengerName}</div>
        </td>
        <td>{passenger?.nationalId || passenger?.passportId}</td>
        <td>{passenger?.nationalityTitle || '-'}</td>
        <td>{passenger?.gender && getPassengerAgeType(passenger?.gender)}</td>
        <td className="ltr">{passenger.birthdayHijri !== '0' ? passenger.birthdayHijri : '-'}</td>
        <td style={{ textAlign: 'left', width: '220px', direction: 'ltr' }}>
          {selectable && index !== -1 && isNeedEdit ? (
            <div>
              <button
                className={styles['editBtn']}
                onClick={() => {
                  if (setSelectedPassenger && setEditModal) {
                    setSelectedPassenger({
                      id: passenger.id as string,
                      name: pasengerName,
                    });
                    setEditModal(true);
                  }
                }}
              >
                ویرایش
              </button>
            </div>
          ) : (
            <div
              style={
                disabledPassengers?.includes(passenger.id as string)
                  ? { pointerEvents: 'none' }
                  : undefined
              }
            >
              <More passengerName={pasengerName} passengerId={passenger.id as string} />
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

export default PassengerItemDesktop;
