import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from 'containers/filter/filterTicket/filterTicket.module.scss';
import { FC, useEffect, useState } from 'react';
import { FilterType } from 'containers/filter/filterTicket/interface';
import { NumberSeparator } from 'utils/helpers/numbers';

interface Props {
  handleFilter: (value: string, type: keyof FilterType) => void;
  data?: number[];
  minMax: { min: number; max: number };
}

const PriceRange: FC<Props> = ({ handleFilter, data, minMax }) => {
  const [value, setValue] = useState<number[]>([minMax.min, minMax.max]);
  const [customStyle, setCustomStyle] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      // Validate data before setting state
      const [minData, maxData] = data;
      if (minData <= maxData) {
        setValue([minData, maxData]);
      }
    } else {
      setValue([minMax.min, minMax.max]);
      setCustomStyle(minMax.min === minMax.max);
    }
  }, [minMax, data]);

  // Generalized handler function
  const handleSliderChange = (newValue: number | number[], onComplete = false) => {
    const newRange = Array.isArray(newValue) ? newValue : [newValue, newValue]; // Ensure it's always an array
    const boundedMin = Math.max(newRange[0], minMax.min);
    const boundedMax = Math.min(newRange[1], minMax.max);
    setValue([boundedMin, boundedMax]);

    // Trigger handleFilter on complete change
    if (onComplete) {
      handleFilter(`${boundedMin},${boundedMax}`, 'price');
    }
  };

  return (
    <>
      <Slider
        className={`${styles['filter__price-slider']} ${
          customStyle ? styles['max-min-equal'] : ''
        }`}
        range
        value={value}
        onChange={(newValue) => handleSliderChange(newValue)}
        onChangeComplete={(newValue) => handleSliderChange(newValue, true)}
        min={minMax.min}
        max={minMax.max}
        step={10}
        allowCross={false}
      />
      <div className={styles['filter__price-sub']}>
        <span className={styles['filter__price-sub__minPrice']}>
          {value ? NumberSeparator(value[1].toString()) : data && data[1]?.toLocaleString()} ریال
        </span>
        <span className={styles['filter__price-sub__maxPrice']}>
          {value ? NumberSeparator(value[0].toString()) : data && data[0]?.toLocaleString()} ریال
        </span>
      </div>
    </>
  );
};

export default PriceRange;
