import styles from './toggleButton.module.scss';
import cn from 'classnames';
import { TourFiltersType } from '../interface';

type ToggleButtonProps = {
  value: string;
  title: string;
  type: keyof TourFiltersType;
  checked: boolean;
  handleClick: (v: string, t: keyof TourFiltersType) => void;
};

const ToggleButton = ({ checked, value, type, title, handleClick }: ToggleButtonProps) => {
  return (
    <div
      className={cn(styles['filterButton'], checked ? styles['filterButton__checked'] : '')}
      onClick={() => handleClick(value, type)}
    >
      <span>{title}</span>
    </div>
  );
};

export default ToggleButton;
