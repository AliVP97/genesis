import styles from './select.module.scss';
import cn from 'classnames';

type SelectItems = {
  label: string;
  options?: { options?: { id?: string; title?: string }[] };
  selected?: string;
};

const SelectItems = ({ label, options }: SelectItems) => {
  return (
    <>
      <option hidden selected className={cn(styles['select-items'])}>
        {label}
      </option>
      {options?.options?.map((option) => (
        <option key={option.id} value={option.id} className={cn(styles['select-items'])}>
          {option?.title}
        </option>
      ))}
    </>
  );
};
export default SelectItems;
