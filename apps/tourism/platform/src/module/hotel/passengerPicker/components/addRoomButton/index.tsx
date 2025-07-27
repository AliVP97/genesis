import { HotelPassengers } from 'module/hotel/ticketsSearchBox/interface';
import styles from './addRoom.module.scss';
import { IncreasePrimaryIcon } from 'assets/icons';

type TAddRoomProps = {
  setPassenger: React.Dispatch<React.SetStateAction<HotelPassengers[]>>;
};

const AddRoom = ({ setPassenger }: TAddRoomProps) => {
  return (
    <div
      className={styles['add-room']}
      onClick={() => setPassenger((prev) => [...prev, { adult: 1, child: [] }])}
    >
      <span>افزودن اتاق</span> <IncreasePrimaryIcon />
    </div>
  );
};

export default AddRoom;
