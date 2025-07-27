import styles from 'containers/filter/filterTicket/filterTicket.module.scss';
import { FilterType } from 'containers/filter/filterTicket/interface';
import { CloseCircleWhiteIcon } from 'assets/icons';
import { parseQuery } from 'utils/helpers/filters';
import { useRouter } from 'next/router';
import { Airline } from 'pages/flights/[id]';
import { useMemo } from 'react';
import cn from 'classnames';

interface Props {
  airlinesList?: Airline[];
  handleUpdate: (value: string, type: keyof FilterType) => void;
  className?: string;
}

const Chips = ({ airlinesList, handleUpdate, className }: Props) => {
  const { query } = useRouter();
  const list: FilterType = parseQuery(query);
  const removeFilterItem = (value: string, key: keyof FilterType) => {
    handleUpdate(value, key);
  };

  const content = useMemo(() => {
    let buttonArr: { name: string; value: string; label: string }[] = [];
    for (const item in list) {
      if (list[item as keyof FilterType]) {
        if (item === 'airlines') {
          list.airlines?.forEach((airlineCode) => {
            const airline = airlinesList?.find((el) => el.code === airlineCode);
            if (airline) {
              buttonArr = [
                ...buttonArr,
                { name: 'airlines', value: airline.code!, label: airline.name! },
              ];
            }
          });
        } else if (item === 'price') {
          buttonArr = [
            ...buttonArr,
            {
              name: 'price',
              value: `${list[item]?.min},${list[item]?.max}`,
              label: `از ${list[item]?.min.toLocaleString('fa-IR')}`,
            },
            {
              name: 'price',
              value: `${list[item]?.min},${list[item]?.max}`,
              label: `تا ${list[item]?.max.toLocaleString('fa-IR')}`,
            },
          ];
        } else if (item === 'ticketType' && list.ticketType) {
          const itemValue = list.ticketType[0];
          // const itemValue = list[item][0]
          buttonArr = [
            ...buttonArr,
            {
              name: item,
              value: itemValue,
              label: itemValue === 'charter' ? 'چارتری' : 'سیستمی',
            },
          ];
        } else if (item === 'flightClass' && list.flightClass) {
          const itemValue = list.flightClass[0];
          // const itemValue = list[item][0]
          buttonArr = [
            ...buttonArr,
            {
              name: item,
              value: itemValue,
              label: itemValue === 'ECONOMY' ? 'اکونومی' : 'بیزینس',
            },
          ];
        } else if (item === 'availableFlights' && list.availableFlights) {
          const itemValue = list.availableFlights[0];
          buttonArr = [
            ...buttonArr,
            {
              name: item,
              value: itemValue,
              label: 'نمایش پرواز های موجود',
            },
          ];
        } else {
          //@ts-ignore
          list[item as keyof FilterType]?.forEach((time: string) => {
            buttonArr.push({ name: 'toward', value: time, label: `رفت ${time}` });
          });
        }
      }
    }

    return buttonArr;
  }, [query]);

  return (
    <>
      {content.map((el, index) => (
        <div
          className={cn(styles['filter__tags'], styles[`${className}`])}
          key={index.toString() + el.name}
        >
          <span>{el.label}</span>
          <span
            onClick={() =>
              removeFilterItem(el.name === 'price' ? ',' : el.value, el.name as keyof FilterType)
            }
            className={styles['filter__tags-close--icon']}
          >
            <CloseCircleWhiteIcon />
          </span>
        </div>
      ))}
    </>
  );
};

export default Chips;
