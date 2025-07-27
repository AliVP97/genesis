import { CloseCircleIcon } from 'assets/icons';
import cn from 'classnames';
import { ReactNode, useState } from 'react';
import { Device } from 'utils/interface';
import { PassengerPayload } from 'services/general/passenger/interface';
import style from './style.module.scss';
import { FromSchema } from 'containers/passengers/utilities/types';
import useOutsideClick from 'utils/hooks/useOutsideClick';
import { useRef } from 'react';
import { FieldValues, UseFormSetValue } from 'react-hook-form';

export type TAutoCompleteListItem = Record<string, string | number | object>;
type TPassenger = PassengerPayload['body']; // to do: refactor
interface Props<T> {
  field: T;
  resultList: TAutoCompleteListItem[] | undefined;
  resetInput: (name: string | undefined, value: FromSchema['defaultValue']) => void;
  setValue: UseFormSetValue<FieldValues>;
  label: string;
  suffix?: ReactNode;
  isError: boolean;
  errorText?: string;
  type?: 'text' | 'number';
  className?: string;
  suffixClassName?: string;
  isFocused?: boolean;
  filterCondition: (iteratedItem: TPassenger) => void;
  listLabel: string[];
  value: string[];
  device?: Device;
  onSelect?: (e: TAutoCompleteListItem) => void;
  hotelAddLeader?: boolean;
  autoCompleteValues?: string[];
}
export const AutoCompleteInput = <T extends { value: string; name: string }>({
  field,
  resultList,
  suffix,
  resetInput,
  label,
  setValue,
  className,
  isError,
  errorText,
  type,
  isFocused,
  suffixClassName,
  filterCondition,
  listLabel,
  device,
  onSelect,
  hotelAddLeader = false,
  autoCompleteValues,
}: Props<T>) => {
  const [openSuggestionList, setOpenSuggestionList] = useState(false);
  const listRef = useRef(null);
  const handleOutsideListClick = () => {
    setOpenSuggestionList(false);
  };
  useOutsideClick(listRef, handleOutsideListClick);

  return (
    <>
      <div className={cn('mb-3', className)}>
        <div
          className={cn(
            style['input'],
            isError
              ? style['input--error']
              : field.value || isFocused
                ? style['input--active']
                : '',
          )}
        >
          <label
            className={cn(
              style['input__label'],
              field.value || isFocused ? style['input__label--active'] : '',
            )}
            htmlFor={field.name}
          >
            {label}
          </label>
          {suffix && <div className={style['input__suffix']}>{suffix}</div>}
          {field.value && (
            <CloseCircleIcon
              onClick={() => {
                resetInput(field.name, '');
                // setValue('', '');
              }}
              className={cn(
                style['input__closeIcon'],
                suffix ? style['input__closeIcon--suffix'] : '',
                suffixClassName,
              )}
            />
          )}
          <input
            {...field}
            id={field.name}
            type={type}
            className={cn(style['input__placeHolder'], field.value ? 'pt-3' : '')}
            onClick={() => {
              setOpenSuggestionList(true);
            }}
            autoComplete="off"
          />
          <div
            className={cn(
              style['item__wrapper'],
              device == 'mobile' && style['item__wrapper--mobile'],
            )}
            ref={listRef}
          >
            {openSuggestionList
              ? resultList
                  ?.filter((x) => filterCondition?.(x))
                  .map((item, index) => (
                    <div
                      className={style['item']}
                      key={index.toString() + 'autoCompleteInput'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(item);
                        autoCompleteValues?.forEach((key) => {
                          if (item[key]) {
                            const val = item[key].toString();
                            setValue(key, val, { shouldValidate: true });
                          }
                        });
                        setOpenSuggestionList(false);
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className={cn(
                            style['item--title'],
                            'pe-2 text-weight-500 color-on-surface',
                          )}
                        >
                          {!hotelAddLeader
                            ? item[listLabel[1]]
                              ? item[listLabel[0]] + ' ' + item[listLabel[1]]
                              : item[listLabel[0]] + ' '
                            : null}
                          {hotelAddLeader
                            ? item['persianName']
                              ? item['persianName'] + ' ' + item['persianFamily']
                              : item['englishName'] + ' ' + item['englishFamily']
                            : null}
                        </div>
                      </div>
                      <div className="color-on-surface text-3">{item[listLabel[2]]}</div>
                    </div>
                  ))
              : null}
          </div>
        </div>

        {isError && (
          <span className="color-error pe-3 pt-1 text-2 text-weight-500 d-block text-end">
            {errorText}
          </span>
        )}
      </div>
    </>
  );
};
