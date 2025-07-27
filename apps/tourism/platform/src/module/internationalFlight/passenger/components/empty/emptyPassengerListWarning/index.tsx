import Button from 'components/button';
import Image from 'next/image';

import EmptyIcon from 'public/images/empty-passenger-list.png';
import { useState } from 'react';
import AddForm from '../../list/mobileView/addForm';
import styles from './emptyPassengerListWarning.module.scss';

type TEmptyPassengerListWarning = {
  getPassengers: () => void;
};
const EmptyPassengerListWarning = ({ getPassengers }: TEmptyPassengerListWarning) => {
  const [addForm, setAddForm] = useState<boolean>(false);
  return (
    <>
      <div className={styles['empty-passenger']}>
        <Image src={EmptyIcon} alt="هیچ مسافری موجود نیست" width={317} height={252} />
        <div className="color-grey-1 mt-4">
          هیچ مسافری در لیست مسافران وجود ندارد. لطفا مسافران این سفر را اضافه کنید
        </div>

        <Button onClick={() => setAddForm(true)} className="mt-4">
          افزودن مسافر
        </Button>
      </div>

      <AddForm getPassengers={getPassengers} setShowForm={setAddForm} showForm={addForm} />
    </>
  );
};

export default EmptyPassengerListWarning;
