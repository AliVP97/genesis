import Checkbox from 'components/checkbox';
import { TSelectInputType } from './types';
import RadioElement from 'components/radio';
import style from './style.module.scss';

type TProps = {
  type: TSelectInputType;
  checked: boolean | undefined;
};
const SelectInput = (props: TProps) => {
  let component = <Checkbox checked={props.checked} />;
  props.type === 'radioButton' &&
    (component = (
      <RadioElement
        className="rtl"
        checked={!!props.checked}
        label=""
        onChange={() => undefined}
        value=""
      />
    ));
  return <span className={style.main}>{component}</span>;
};

export { SelectInput };
