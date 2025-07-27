import classNames from 'classnames';
import RadioButton from './RadioButton';
import styles from './RadioButtonGroup.module.scss';

type RadioButtonGroupProps = {
  data: string[];
  value: number;
  onChange: (value: string) => void;
};

const RadioButtonGroup = ({ data, onChange, value }: RadioButtonGroupProps) => (
  <div className={classNames('d-flex flex-column', styles.gap)}>
    {data.map((item, index) => (
      <RadioButton
        key={index}
        label={item}
        onChange={onChange}
        value={String(index)}
        checked={value === index}
      />
    ))}
  </div>
);

export default RadioButtonGroup;
