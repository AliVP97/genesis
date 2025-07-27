import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import { conditionList } from '../conditions/conditionList';
import { ChevronLeftBlueIcon } from 'assets/icons';
import cn from 'classnames';
import styles from '../../../../styles/invoice.module.scss';
type RulesProps = {
  openModal: () => void;
};
const Rules = ({ openModal }: RulesProps) => {
  const { isMobile } = useDeviceDetect();
  return (
    <>
      {isMobile ? (
        <div className={cn(styles['usage-rules'], 'd-flex justify-content-end')}>
          <button
            className="border-0 color-primary bg-transparent fs-3 py-2"
            onClick={() => openModal()}
          >
            قوانین و شرایط استفاده
            <ChevronLeftBlueIcon />
          </button>
        </div>
      ) : (
        <div className={cn(styles['usage-rules'], 'col-md-8 border-end')}>
          <p className="fs-3">قوانین و شرایط استفاده</p>
          <ul className="pe-4 lh-2">
            {conditionList.map((condition) => (
              <li key={condition.id} className={cn(styles['color-black-2'], 'fs-3')}>
                {condition.item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Rules;
