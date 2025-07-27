import { Dispatch, SetStateAction } from 'react';
import { TRoom } from 'services/hotel/detail/interface';
import styles from './explanation.module.scss';
import Modal from 'components/modal';
import { breakLines } from 'utils/helpers/breakLines';
interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  roomInfo: TRoom;
}
export const Explanation = ({ visible, setVisible, roomInfo }: IProps) => {
  return (
    <Modal
      bottomSheetStyles={styles['explanation__modal']}
      visible={visible}
      setVisible={setVisible}
      bottomSheet
    >
      <div className="w-100 d-flex d-flex flex-column align-items-center text-justify p-3">
        <div className="text-4 text-weight-500 pb-2">توضیحات اتاق</div>
        <div className="text-4 text-weight-500 pb-2">{roomInfo?.room?.roomInfo?.name}</div>
        <h6 className="ltr text-3 align-self-start">
          {breakLines(roomInfo?.room?.roomInfo?.description as string)}
        </h6>
      </div>
    </Modal>
  );
};
