import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import cn from 'classnames';
import Divider from 'components/divider';
import Modal from 'components/modal';
import dayjs from 'dayjs';
import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';
import { ReactNode, useState } from 'react';
import { TPassengerV2 } from 'services/general/passenger/interface';
import CompleteInformation from '../../completeInformation';
import EditPassenger from '../../edit';
import RemovePassenger from '../../remove';
import PassengerItemDetails from './details';
import styles from './mobileViewItem.module.scss';
import More from './more';

type TPassengerItemProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
};
const PassengerItem = ({ passenger, getPassengers }: TPassengerItemProps) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [completeModal, setCompleteModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  let formattedBirthday: string | ReactNode = '-';

  if (passenger?.birthday !== '0') {
    if (passenger?.passportId) {
      formattedBirthday = dayjs(Number(passenger?.birthday) * 1000, {
        jalali: false,
      })
        .calendar('gregory')
        .format('YYYY MMM DD');
    } else {
      formattedBirthday = (
        <span dir="rtl">
          {new Date(Number(passenger?.birthday) * 1000).toLocaleDateString('fa-Ir', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
    }
  }

  let passportExpireDate: string | undefined;
  if (Number(passenger?.passportExpireDate) > 0) {
    passportExpireDate =
      passenger?.passportExpireDate &&
      dayjs(Number(passenger?.passportExpireDate) * 1000, { jalali: false })
        .calendar('gregory')
        .format('YYYY MMM DD');
  }
  const gender = getPassengerAgeType(passenger?.gender || 'GENDER_TYPE_UNDEFINED') || '-';

  const idTitle: string[] = [],
    idValue: string[] = [];
  idTitle[0] = passenger?.passportId ? 'شماره پاسپورت' : 'کد ملی';
  idValue[0] = passenger?.passportId ? passenger?.passportId || '-' : passenger?.nationalId || '-';
  idTitle[1] = passenger?.passportId ? 'تاریخ انقضا پاسپورت' : 'جنسیت';
  idValue[1] = passenger?.passportId ? passportExpireDate || '-' : gender || '-';

  const fullName = passenger?.passportId
    ? `${passenger.englishName} ${passenger.englishFamily}`
    : `${passenger.persianName} ${passenger.persianFamily}`;

  return (
    <>
      <div
        className={cn(
          styles['passenger-item'],
          'd-flex align-items-start justify-content-center px-3 mb-3 flex-column',
        )}
      >
        <div
          className={cn(
            styles['passenger-item__header'],
            'd-flex justify-content-between align-items-center w-100',
          )}
        >
          <div onClick={() => setExpand((prev) => !prev)}>
            {expand ? <ArrowUpIcon className="me-auto" /> : <ArrowDownIcon className="me-auto" />}
            <b>{fullName}</b>
          </div>
          <div className="d-flex align-items-center">
            <div>
              <More setRemoveModal={setRemoveModal} setEditModal={setEditModal} />
            </div>
          </div>
        </div>
        {expand && (
          <div className={cn('d-flex flex-column justify-content-center align-items-center w-100')}>
            <Divider type="horizontal" className="w-100" />
            <div className="d-flex flex-column w-100 py-3">
              <div className="d-flex justify-content-between w-100 my-2">
                <span className="color-on-surface-var">{formattedBirthday}</span>
                <span className="color-on-surface">تاریخ تولد</span>
              </div>
              <PassengerItemDetails title={idTitle[0]} value={idValue[0]} />
              <PassengerItemDetails title={idTitle[1]} value={idValue[1]} />
            </div>
          </div>
        )}
      </div>

      {/* ******  Handle error for complete passenger  ****** */}
      <Modal onClose={() => setCompleteModal(false)} visible={completeModal}>
        <CompleteInformation
          fullName={`${passenger?.englishName} ${passenger?.englishFamily}`}
          close={() => setCompleteModal(false)}
          openEditFrom={() => setEditModal(true)}
        />
      </Modal>

      {/* ******  Edit passenger information   ****** */}
      <Modal onClose={() => setEditModal(false)} visible={editModal}>
        <EditPassenger
          passenger={passenger}
          getPassengers={getPassengers}
          setEditModal={setEditModal}
        />
      </Modal>
      {/* ******  Remove passenger  ****** */}
      <Modal onClose={() => setRemoveModal(false)} visible={removeModal}>
        <RemovePassenger
          fullName={`${passenger?.englishName} ${passenger?.englishFamily}`}
          id={passenger?.id || ''}
          close={() => setRemoveModal(false)}
          getPassengers={getPassengers}
        />
      </Modal>
    </>
  );
};

export default PassengerItem;
