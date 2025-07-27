import { TCancelationRules } from '.';
import styles from 'module/hotel/detail/details.module.scss';
import cn from 'classnames';
interface CancelationRulesProps {
  rules: TCancelationRules;
}
const CancelationRules = ({ rules }: CancelationRulesProps) => {
  return (
    <>
      {rules?.map((element, index) => {
        return (
          <div
            key={index.toString() + element?.penalty + 'hotel'}
            className={cn(
              styles[`rooms__selectRooms__lastItem`],
              index !== rules.length - 1 ? styles['rules__cancellationRules'] : '',
              'd-flex flex-column justify-content-end pb-2 pt-2',
            )}
          >
            <div className="color-red text-weight-500">{element.penalty}</div>
            <div className="pt-1 text-weight-400 text-4 color-grey-24">{element.text}</div>
          </div>
        );
      })}
    </>
  );
};

export default CancelationRules;
