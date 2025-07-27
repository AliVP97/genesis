import { FC } from 'react';
import { FilterType } from 'containers/filter/filterTicket/interface';
import styles from './filterButton.module.scss';
import cn from 'classnames';

interface FilterButtonProps {
  value: string;
  title: string;
  type: keyof FilterType;
  checked: boolean;
  handleClick: (v: string, t: keyof FilterType) => void;
}
const FilterButton: FC<FilterButtonProps> = ({ checked, value, type, title, handleClick }) => {
  return (
    <div
      className={cn(styles['filterButton'], checked ? styles['filterButton--checked'] : '')}
      onClick={() => handleClick(value, type)}
    >
      <span>{title}</span>
    </div>
  );
};

export default FilterButton;
