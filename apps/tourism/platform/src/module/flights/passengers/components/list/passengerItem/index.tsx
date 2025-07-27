import Checkbox from 'components/checkbox';
import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';

import dayjs from 'dayjs';
import { Delete, Edit } from 'assets/icons';
import { useState } from 'react';
import Modal from 'components/modal';
import RemovePassenger from '../remove';
import EditPassenger from '../edit';
import CompleteInformation from '../completeInformation';
import { TPassengerV2 } from 'services/general/passenger/interface';
import Nationality from '../nationality';
import { useIsNajafBaghdad } from 'utils/hooks/useIsNajafBaghdad';

type TPassengerItemProps = {
  passenger: TPassengerV2;
  selectedPassengers: Array<TPassengerV2>;
  setPassenger: (passenger: TPassengerV2) => void;
  getPassengers: () => void;
};

const PassengerItem = ({
  passenger,
  selectedPassengers,
  setPassenger,
  getPassengers,
}: TPassengerItemProps) => {
  const [removeModal, setRemoveModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [completeModal, setCompleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TPassengerV2>();
  const [nationalityModal, setNationalityModal] = useState<boolean>(false);
  const isNajafAndBaghdad = useIsNajafBaghdad();

  const handleSelectPassenger = () => {
    if (passenger.nationality !== 'IR') {
      setSelectedUser(passenger);
      setNationalityModal(true);
    } else if (isNajafAndBaghdad) {
      if (!passenger.passportId) {
        setSelectedUser(passenger);
        setCompleteModal(true);
      } else setPassenger(passenger);
    } else if (
      (!passenger.nationalId && !passenger.passportId) ||
      !passenger.englishName ||
      !passenger.englishFamily ||
      (passenger?.nationality === 'IR' && !passenger.persianName) ||
      (passenger?.nationality === 'IR' && !passenger.persianFamily) ||
      passenger.englishFamily === '0'
    ) {
      setSelectedUser(passenger);
      setCompleteModal(true);
    } else setPassenger(passenger);
  };

  const formattedBirthdayGregorian =
    passenger?.birthday === '0'
      ? '-'
      : dayjs(Number(passenger?.birthday) * 1000, { jalali: false })
          .calendar('gregory')
          .format('YYYY MMM DD');

  const formattedBirthdayPersian =
    passenger?.birthday === '0'
      ? '-'
      : new Date(Number(passenger?.birthday) * 1000).toLocaleDateString('fa-IR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

  return (
    <>
      <tr>
        <td>
          <div onClick={handleSelectPassenger} className="d-flex justify-content-center w-100 pe-1">
            <Checkbox checked={selectedPassengers.some((x) => x.id == passenger.id)} />
          </div>
        </td>
        <td>
          <div>{passenger?.englishName + ' ' + passenger?.englishFamily}</div>
          <div>{passenger?.persianName + ' ' + passenger?.persianFamily}</div>
        </td>

        <td>{passenger?.gender && getPassengerAgeType(passenger?.gender)}</td>

        <td>{passenger?.nationalId || '-'}</td>

        <td>{passenger?.passportId || '-'}</td>

        <td className="ltr">
          {passenger?.passportExpireDate != '0001-01-01' &&
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
          {passenger?.passportId ? (
            <>
              <div>
                <span>{formattedBirthdayGregorian}</span>
              </div>
              <div dir="rtl">
                <small className="color-grey-24">{formattedBirthdayPersian}</small>
              </div>
            </>
          ) : (
            <>
              <div dir="rtl">
                <span>{formattedBirthdayPersian}</span>
              </div>
            </>
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
      {/* ******  Edit nationality information   ****** */}
      <Modal onClose={() => setNationalityModal(false)} visible={nationalityModal}>
        {selectedUser && selectedUser?.id && <Nationality close={setNationalityModal} />}
      </Modal>

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
