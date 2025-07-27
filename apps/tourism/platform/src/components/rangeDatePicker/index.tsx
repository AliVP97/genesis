import { useEffect, useState } from 'react';
import style from './style.module.scss';
import Calendar from 'containers/datepicker/datepicker';
import { TRangeDatePickerProps, TRangeDatePickerCalendarSystem } from './types';
import { timestampToDate } from './helper';
import SwitchButton from 'components/switchButton';
import { Calender as CalendarIcon, DownArrowIcon } from 'assets/icons';
import { useAppDispatch } from 'store/hook/storeHook';
import { searchCalendarSystemChanged } from 'store/slices/app/app';

const RangeDatePicker = (props: TRangeDatePickerProps) => {
  const dispatch = useAppDispatch();
  const [range, setRange] = useState(props.range);
  useEffect(() => {
    setRange(range);
  }, [range]);

  const [bottomSheetIsVisible, setBottomSheetIsVisible] = useState(false);
  const handleCalendarClick = () => {
    setBottomSheetIsVisible(true);
  };
  useEffect(() => {
    const bodyStyle = document.getElementsByTagName('body')[0].style;
    bottomSheetIsVisible ? (bodyStyle.overflowY = 'hidden') : (bodyStyle.overflowY = 'scroll');

    return () => {
      bodyStyle.overflowY = 'scroll';
    };
  }, [bottomSheetIsVisible]);

  const [calendarSystem, setCalendarSystem] = useState<TRangeDatePickerCalendarSystem>(
    props.calendarSystem,
  );
  useEffect(() => {
    setCalendarSystem(props.calendarSystem);
  }, [props.calendarSystem]);
  const handleCalendarSystemOnChange = (event: boolean) => {
    const calendarSystem: TRangeDatePickerCalendarSystem = event ? 'gregorian' : 'jalali';

    setCalendarSystem(calendarSystem);
    localStorage.setItem('searchCalendarSystem', calendarSystem);
    dispatch(searchCalendarSystemChanged(calendarSystem));
  };

  const handleCalendarOnChange = (timestamp: number | null, endDate: number | null) => {
    setRange({ from: timestamp, to: endDate });
  };

  const handleRangeSubmit = () => {
    props.onSubmit(range);
    setBottomSheetIsVisible(false);
  };

  return (
    <>
      <div className={style['main-panel']} hidden={props.hidden}>
        <div className={style['dates']}>
          <div>
            <span>{timestampToDate(props.range.from, calendarSystem)}</span>
            {' - '}
            <span>{timestampToDate(props.range.to, calendarSystem)}</span>
          </div>
        </div>
        <div className={style['calendar-icon']} onClick={handleCalendarClick}>
          <CalendarIcon />
        </div>
      </div>
      <div
        className={style['bottomsheet']}
        style={{ display: bottomSheetIsVisible ? 'block' : 'none' }}
      >
        <div className={style['picker']} style={{ height: '100%' }}>
          <div className={style['header']}>
            <div className={style['section-1']}>
              <span className={style['title']}>تاریخ سفر</span>
              <span
                className={style['icon']}
                onClick={() => {
                  setBottomSheetIsVisible(false);
                }}
              >
                <DownArrowIcon />
              </span>
            </div>
            <div className={style['section-2']}>
              <div className={style['title']}>{props.title || ''}</div>
              <div className={style['calendar-system-switch']}>
                <label>تقویم میلادی</label>
                <SwitchButton
                  defaultChecked={calendarSystem === 'gregorian'}
                  onChange={handleCalendarSystemOnChange}
                />
              </div>
            </div>
          </div>
          <div className={style['dates']}>
            <Calendar
              view="mobile"
              onChange={handleCalendarOnChange}
              locale={calendarSystem === 'gregorian' ? 'en' : 'fa'}
              onLocaleChange={() => null}
              type="range"
              doubleMonth={false}
              showDatePicker
              startDate={range.from}
              endDate={range.to}
              // application={application}
              allowSimilarDates={props.allowSimilarDates}
              showOccasions={true}
            />
          </div>
          <div className={style['footer']}>
            <div className={style['dates']}>
              <div>
                <div className={style['title']}>رفت</div>
                <div className={style['main']}>{timestampToDate(range.from, calendarSystem)}</div>
                <div className={style['secondary']}>
                  {timestampToDate(
                    range.from,
                    calendarSystem === 'gregorian' ? 'jalali' : 'gregorian',
                  )}
                </div>
              </div>
              <div>
                <div className={style['title']}>برگشت</div>
                <div className={style['main']}>{timestampToDate(range.to, calendarSystem)}</div>
                <div className={style['secondary']}>
                  {timestampToDate(
                    range.to,
                    calendarSystem === 'gregorian' ? 'jalali' : 'gregorian',
                  )}
                </div>
              </div>
            </div>
            <div className={style['submit-button']}>
              <button onClick={handleRangeSubmit}>تایید</button>
            </div>
          </div>
        </div>
      </div>
      {/* </BottomSheet> */}
    </>
  );
};

export { RangeDatePicker };
