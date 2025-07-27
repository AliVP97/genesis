import Checkbox from 'components/checkbox';
import { FilterType } from 'containers/filter/filterTicket/interface';
import styles from './availableFlights.module.scss';
import { useEffect, useState } from 'react';
interface Props {
  handleClick: (value: string, type: keyof FilterType) => void;
  filters: FilterType;
}
const AvailableFlights = ({ handleClick, filters }: Props) => {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    let availableFlights;
    if (Array.isArray(filters['availableFlights'])) {
      availableFlights = filters['availableFlights'].length > 0;
    } else {
      availableFlights = !!filters['availableFlights'];
    }
    setChecked(availableFlights);
  }, [filters]);

  const handleCheckbox = () => {
    handleClick(String(!checked), 'availableFlights');
    setChecked(!checked);
  };
  return (
    <div className={styles['availableFlights']}>
      <div onClick={handleCheckbox}>
        <Checkbox checked={checked} />
      </div>
      <span>نمایش پرواز های موجود</span>
    </div>
  );
};

export default AvailableFlights;
