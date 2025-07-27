import { Info } from 'assets/icons';
import style from './style.module.scss';
import classNames from 'classnames';

type TSelectedPassengerNumberWarningProps = {
  adult: number;
  child: number;
  infant: number;
};

const SelectedPassengerNumberWarning = ({
  adult,
  child,
  infant,
}: TSelectedPassengerNumberWarningProps) => {
  return (
    <>
      <div
        className={classNames(
          'bg-color-grey-18  text-end py-4 px-3 d-flex justify-content-end',
          style['main'],
        )}
      >
        <span className={classNames('pe-2 color-black-2 text-breaks', style['text'])}>
          <span>تعداد مسافران قابل انتخاب</span>
          <span>{` ${adult} بزرگسال`}</span> {child > 0 && `و ${child} کودک `}{' '}
          {infant > 0 && <>{`و ${infant} نوزاد `}</>}
          <span>میباشد </span>
        </span>
        <div>
          <Info />
        </div>
      </div>
    </>
  );
};

export default SelectedPassengerNumberWarning;
