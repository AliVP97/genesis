import { useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import dayjs from 'dayjs';

import Checkbox from 'components/checkbox';
import Divider from 'components/divider';
import Modal from 'components/modal';
import { getPassengerAgeType } from 'module/flights/travels/helper/travelHelper';
import { TPassengerV2 } from 'services/general/passenger/interface';
import CompleteInformation from '../../completeInformation';
import EditPassenger from '../../edit';
import { isInvalidPassenger } from '../../passengerItem';
import RemovePassenger from '../../remove';
import PassengerItemDetails from './details';
import More from './more';

import { ArrowDownIcon, ArrowUpIcon } from 'assets/icons';
import styles from './mobileViewItem.module.scss';

type TPassengerItemProps = {
  passenger: TPassengerV2;
  checked: boolean;
  getPassengers: () => void;
  setPassenger: (e: TPassengerV2) => void;
};

const PassengerItem = ({
  passenger,
  checked,
  getPassengers,
  setPassenger,
}: TPassengerItemProps) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [completeModal, setCompleteModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const { query } = useRouter();

  const selectPassenger = () => {
    if (isInvalidPassenger(passenger, query?.isInternational === 'true')) {
      setCompleteModal(true);
    } else setPassenger(passenger);
  };

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
          <div className="d-flex align-items-center">
            <div>
              <More setRemoveModal={setRemoveModal} setEditModal={setEditModal} />
            </div>
          </div>
          <div className="d-flex">
            <div onClick={() => setExpand((prev) => !prev)}>
              {expand ? <ArrowUpIcon className="me-auto" /> : <ArrowDownIcon className="me-auto" />}
              <b>
                {passenger?.passportId ? (
                  <>
                    {' '}
                    {passenger?.englishName} {passenger?.englishFamily}
                  </>
                ) : (
                  <>
                    {' '}
                    {passenger?.persianName} {passenger?.persianFamily}
                  </>
                )}
              </b>
            </div>
            <div onClick={selectPassenger}>
              <Checkbox checked={checked} />
            </div>
          </div>
        </div>
        {expand && (
          <div className={cn('d-flex flex-column justify-content-center align-items-center w-100')}>
            <Divider type="horizontal" className="w-100" />
            <div className="d-flex flex-column w-100 py-3">
              <div className="d-flex justify-content-between w-100 my-2">
                <span className="color-grey-19 ">
                  {passenger?.passportId ? (
                    passenger?.birthday && passenger?.birthday !== '0' ? (
                      passenger?.birthdayString
                    ) : (
                      '-'
                    )
                  ) : passenger?.birthday && passenger?.birthday !== '0' ? (
                    <span dir="rtl">{passenger?.hijriBirthdayString}</span>
                  ) : (
                    '-'
                  )}
                </span>
                <span className="color-grey-19">تاریخ تولد</span>
              </div>

              {passenger?.passportId ? (
                <PassengerItemDetails title="شماره پاسپورت" value={passenger?.passportId || '-'} />
              ) : (
                <PassengerItemDetails title="کد ملی" value={passenger?.nationalId || '-'} />
              )}

              {passenger?.passportId ? (
                <PassengerItemDetails
                  title="تاریخ انقضا پاسپورت"
                  value={
                    Number(passenger?.passportExpireDate) > 0
                      ? passenger?.passportExpireDate
                        ? dayjs(Number(passenger?.passportExpireDate) * 1000, {
                            jalali: false,
                          })
                            .calendar('gregory')
                            .format('DD MMM YYYY')
                        : '-'
                      : '-'
                  }
                />
              ) : (
                <PassengerItemDetails
                  title="جنسیت"
                  value={getPassengerAgeType(passenger?.gender || 'GENDER_TYPE_UNDEFINED')}
                />
              )}
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
