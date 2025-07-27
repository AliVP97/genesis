import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import { memo } from 'react';
import styles from './MultiSelectItem.module.scss';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';

type MultiSelectItemProps = {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  statusText: string;
  statusColor: string;
  onChange: (value: boolean) => void;
};

const MultiSelectItem = memo(
  ({ id, checked, label, onChange, disabled, statusColor, statusText }: MultiSelectItemProps) => {
    const { isMobile } = useDeviceDetect();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <div className={classNames('d-flex align-items-center ps-1', styles['checkbox-container'])}>
        <Checkbox id={id} checked={checked} disabled={disabled} onChange={handleChange} />
        <label htmlFor={id} className={classNames('fw-500', styles.label)}>
          {label}
        </label>
        {statusText && (
          <span
            className={classNames('me-auto', styles.status, !isMobile && 'fw-500')}
            style={{ color: statusColor }}
          >
            {statusText}
          </span>
        )}
      </div>
    );
  },
);

MultiSelectItem.displayName = 'MultiSelectItem';
export default MultiSelectItem;
