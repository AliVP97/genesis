import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined';
};

const Button = ({ children, className, onClick, disabled, variant = 'primary' }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(styles.button, styles[variant], className)}
  >
    {children}
  </button>
);

export default Button;
