import Image from 'next/image';
import styles from './item.module.scss';
import cn from 'classnames';
interface ISliderItemProps {
  image: string;
  title: string;
  currentIndex: number;
  dots: boolean;
  login: boolean;
  setLoginModalVisible: (visible: boolean) => void;
  setOpenReportModal: (open: boolean) => void;
  setImageSelected: (image: string) => void;
  setAccessOpenReportModal: (open: boolean) => void;
}
const SliderItem = ({
  image,
  title,
  currentIndex,
  dots = true,
  login,
  setLoginModalVisible,
  setOpenReportModal,
  setImageSelected,
  setAccessOpenReportModal,
}: ISliderItemProps) => {
  return (
    <>
      <div
        className={cn(dots == true ? styles['slide-item'] : styles['item'])}
        style={{ transform: `translate(-${currentIndex * 100}%)` }}
      >
        <button
          onClick={(e) => {
            setImageSelected(`${image}`);
            if (!login) {
              setLoginModalVisible(true);
              setAccessOpenReportModal(true);
              return;
            }
            e.stopPropagation();
            setOpenReportModal(true);
          }}
          className={cn(styles['report-button'], 'cursor-pointer')}
        >
          گزارش مشکل
        </button>
        <Image loader={() => image} src={`${image}`} alt={title} layout="fill" />
      </div>
    </>
  );
};

export default SliderItem;
