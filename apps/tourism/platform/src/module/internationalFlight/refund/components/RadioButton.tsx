import styles from './RadioButton.module.scss';
import RadioElement from 'components/radio';

type RadioItemBoxProps = {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

const RadioButton = ({ label, onChange, value, checked }: RadioItemBoxProps) => (
  <div className={styles.box}>
    <RadioElement value={value} label={label} checked={checked} onChange={onChange} />
  </div>
);

export default RadioButton;
