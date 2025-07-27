import { useState } from 'react';
import { useRouter } from 'next/router';

import Checkbox from 'components/checkbox';
import Modal from 'components/modal';
import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';
import { TPassengerV2 } from 'services/general/passenger/interface';
import CompleteInformation from '../completeInformation';
import EditPassenger from '../edit';
import RemovePassenger from '../remove';

import { Delete, Edit } from 'assets/icons';

type TPassengerItemProps = {
  passenger: TPassengerV2;
  selectedPassengers: Array<TPassengerV2>;
  setPassenger: (passenger: TPassengerV2) => void;
  getPassengers: () => void;
};

export const isInvalidPassenger = (passenger: TPassengerV2, isInternational = false) => {
  const isForeign = !(passenger?.passportCountry === 'IRN');

  if (isInternational) {
    if (
      !passenger?.persianName ||
      !passenger?.persianFamily ||
      !passenger?.englishName ||
      !passenger?.englishFamily
    ) {
      return true;
    }
  }

  if (isForeign) {
    return (
      passenger?.birthday === '0' ||
      !passenger?.englishName ||
      !passenger?.englishFamily ||
      !passenger?.passportId ||
      !passenger?.passportExpireDate
    );
  } else {
    return (
      passenger?.birthday === '0' ||
      !passenger?.nationalId ||
      !passenger?.persianName ||
      !passenger?.persianFamily
    );
  }
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

  const { query } = useRouter();

  const handleSelectPassenger = () => {
    if (isInvalidPassenger(passenger, query?.isInternational === 'true')) {
      setSelectedUser(passenger);
      setCompleteModal(true);
    } else setPassenger(passenger);
  };

  return (
    <>
      <tr>
        <td>
          <div onClick={handleSelectPassenger} className="d-flex justify-content-center w-100 pe-1">
            <Checkbox checked={selectedPassengers.some((x) => x.id == passenger?.id)} />
          </div>
        </td>
        <td>
          <div>{passenger?.englishName + ' ' + passenger?.englishFamily}</div>
          <div>{passenger?.persianName + ' ' + passenger?.persianFamily}</div>
        </td>

        <td>{passenger?.gender && getPassengerAgeType(passenger?.gender)}</td>

        <td>{passenger?.nationalId || passenger?.passportId || '-'}</td>

        <td className="ltr">
          {
            <div dir="rtl">
              <span>{passenger?.birthday === '0' ? '-' : passenger?.hijriBirthdayString}</span>
            </div>
          }
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
