import cn from 'classnames';
import styles from 'components/stepper/stepper.module.scss';
import { Checked } from 'assets/icons';

const Step = ({
  title,
  checked,
  current,
}: {
  title: string;
  checked: boolean;
  current: boolean;
}) => {
  return (
    <div className={cn(styles['stepper__step'], 'd-flex w-100')}>
      <div
        className={cn(
          styles['stepper__step__line'],
          !(checked || current) && styles['stepper__step__line--unChecked'],
        )}
      />
      <div
        className={cn(
          styles['stepper__step__circle'],
          'd-block',
          !(checked || current) && styles['stepper__step__circle--unChecked'],
        )}
      >
        <Checked
          className={cn(
            styles['stepper__step__circle__checked-icon'],
            !(checked && !current) ? styles['stepper__step__circle__checked-icon--unchecked'] : '',
          )}
        />
        <div
          className={cn(
            styles['stepper__step__circle__title'],
            !checked && styles['stepper__step__circle__title--unChecked'],
          )}
        >
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};
export default Step;
