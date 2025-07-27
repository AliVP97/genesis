import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';

import dayjs from 'dayjs';
import { Delete, Edit } from 'assets/icons';
import { useState } from 'react';
import Modal from 'components/modal';
import RemovePassenger from '../remove';
import EditPassenger from '../edit';
import CompleteInformation from '../completeInformation';
import { TPassengerV2 } from 'services/general/passenger/interface';
import { DATE_UTILS } from 'utils/helpers/dateUtils';

type TPassengerItemProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
};

const PassengerItem = ({ passenger, getPassengers }: TPassengerItemProps) => {
  const [removeModal, setRemoveModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [completeModal, setCompleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TPassengerV2>();

  const formatGregorianBirthday = (birthdayString?: string): string => {
    if (!birthdayString) return '-';
    const parts = birthdayString.split('-');
    return `${parts[0]} ${DATE_UTILS.months.gregorian[Number(parts[1]) - 1]} ${parts[2]}`;
  };

  const formatHijriBirthday = (hijriBirthdayString?: string): string => {
    if (!hijriBirthdayString) return '-';
    const parts = hijriBirthdayString.split('-');
    return `${parts[2]} ${DATE_UTILS.months.jalali[Number(parts[1]) - 1]} ${parts[0]}`;
  };

  const formatNonPassportBirthday = (passenger: TPassengerV2): string => {
    if (passenger?.birthday === '1' || passenger?.birthday === '0') return '-';
    return formatHijriBirthday(passenger.hijriBirthdayString);
  };

  return (
    <>
      <tr>
        <td>
          <div>{`${passenger?.englishName} ${passenger?.englishFamily}`}</div>
          <div>{`${passenger?.persianName} ${passenger?.persianFamily}`}</div>
        </td>

        <td>{passenger?.gender && getPassengerAgeType(passenger?.gender)}</td>

        <td>{passenger?.nationalId || '-'}</td>

        <td>{passenger?.passportId || '-'}</td>

        <td className="ltr">
          {passenger?.passportId &&
          passenger?.passportExpireDate != '0001-01-01' &&
          Number(passenger?.passportExpireDate) > 0
            ? dayjs(Number(passenger?.passportExpireDate) * 1000, {
                jalali: false,
              })
                .calendar('gregory')
                .format('YYYY MMM DD')
            : '-'}
        </td>

        <td>{passenger?.countryObject?.countryNameFa || '-'}</td>

        <td className="ltr">
          {passenger.birthday !== '0' ? (
            passenger?.passportId ? (
              <>
                <div>
                  <span>{formatGregorianBirthday(passenger.birthdayString)}</span>
                </div>
                <div dir="rtl">
                  <small className="color-on-surface-var">
                    {formatHijriBirthday(passenger.hijriBirthdayString)}
                  </small>
                </div>
              </>
            ) : (
              <div dir="rtl">
                <span>{formatNonPassportBirthday(passenger)}</span>
              </div>
            )
          ) : (
            '-'
          )}
        </td>
        <td>
          <span
            onClick={() => {
              setEditModal(true);
              setSelectedUser(passenger);
            }}
          >
            <Edit />
          </span>
          <span
            onClick={() => {
              setRemoveModal(true);
              setSelectedUser(passenger);
            }}
          >
            <Delete />
          </span>
        </td>
      </tr>
      {/* ******  Handle error for complete passenger  ****** */}
      <Modal onClose={() => setCompleteModal(false)} visible={completeModal}>
        {selectedUser && selectedUser?.id && (
          <CompleteInformation
            fullName={`${selectedUser?.englishName} ${selectedUser?.englishFamily}`}
            close={() => setCompleteModal(false)}
            openEditFrom={(e: boolean) => setEditModal(e)}
          />
        )}
      </Modal>

      {/* ******  Edit passenger information   ****** */}
      <Modal onClose={() => setEditModal(false)} visible={editModal}>
        {selectedUser && selectedUser?.id && (
          <EditPassenger
            passenger={selectedUser}
            getPassengers={getPassengers}
            setEditModal={setEditModal}
          />
        )}
      </Modal>

      {/* ******  Remove passenger  ****** */}
      <Modal onClose={() => setRemoveModal(false)} visible={removeModal}>
        {selectedUser && selectedUser?.id && (
          <RemovePassenger
            fullName={
              selectedUser?.englishName
                ? `${selectedUser?.englishName} ${selectedUser?.englishFamily}`
                : `${selectedUser?.persianName} ${selectedUser?.persianFamily}`
            }
            id={selectedUser?.id}
            close={() => setRemoveModal(false)}
            getPassengers={getPassengers}
          />
        )}
      </Modal>
    </>
  );
};

export default PassengerItem;
