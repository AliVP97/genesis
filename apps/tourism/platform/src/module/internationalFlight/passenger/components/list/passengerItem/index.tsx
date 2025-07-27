import Checkbox from 'components/checkbox';
import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';

import { Delete, Edit } from 'assets/icons';
import { useState } from 'react';
import Modal from 'components/modal';
import RemovePassenger from '../remove';
import EditPassenger from '../edit';
import CompleteInformation from '../completeInformation';
import { TPassengerV2 } from 'services/general/passenger/interface';

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

  const handleSelectPassenger = () => {
    if (!passenger.passportId) {
      setSelectedUser(passenger);
      setCompleteModal(true);
    } else setPassenger(passenger);
  };

  return (
    <>
      <tr>
        <td>
          <div onClick={handleSelectPassenger} className="d-flex justify-content-center w-100 pe-1">
            <Checkbox checked={selectedPassengers.some((x) => x.id == passenger.id)} />
          </div>
        </td>
        <td>
          {passenger?.englishName + ' ' + passenger?.englishFamily}{' '}
          {!passenger?.englishName && `${passenger?.persianName}  ${passenger?.persianFamily}`}
        </td>

        <td>{passenger?.gender && getPassengerAgeType(passenger?.gender)}</td>

        <td>{passenger?.nationalId || '-'}</td>

        <td className="en">{passenger?.passportId || '-'}</td>

        <td className="ltr" style={{ fontFamily: 'Roboto' }}>
          {passenger?.passportExpireDateString != '0001-01-01' &&
            passenger?.passportExpireDateString}
        </td>

        <td>{passenger?.countryObject?.countryNameFa || '-'}</td>

        <td className="ltr" style={{ fontFamily: 'Roboto' }}>
          {passenger?.birthdayString}
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
            fullName={`${selectedUser?.englishName} ${selectedUser?.englishFamily}`}
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
