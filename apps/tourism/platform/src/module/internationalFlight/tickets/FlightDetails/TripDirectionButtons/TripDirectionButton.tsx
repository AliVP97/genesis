import { FC } from 'react';
import cn from 'classnames';
import styles from './TripDirectionButton.module.scss';
import { CheckIcon } from 'assets/icons';

type ButtonProps = {
  active: boolean;
  onClick: () => void;
};

const Button: FC<ButtonProps> = ({ active, onClick, children }) => (
  <button
    className={cn(
      'd-flex flex-row justify-content-center align-items-center',
      styles['button'],
      active && styles['--active'],
    )}
    onClick={onClick}
  >
    {active && <CheckIcon className={cn(styles['icon'], 'ms-2')} />}
    {!active && <div className={cn('ms-2', styles['empty-icon'])}></div>}
    <span className="justify-content-end">{children}</span>
  </button>
);

export default Button;
