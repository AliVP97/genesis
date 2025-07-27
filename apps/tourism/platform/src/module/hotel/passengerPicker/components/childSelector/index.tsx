import React from 'react';
import { childTypeConvertor } from '../../helper';
import { PersianIndexNumber } from 'utils/helpers/persianIndexNumber';

import SelectOutlet, { IOption } from './select';

type TChildSelectorProps = {
  hotelPassengerConfig: IPassengersHotelConfig | undefined;
  index: number;
  value: string;
  selectAge: (e: string) => void;
};

const ChildSelector = ({ hotelPassengerConfig, index, value, selectAge }: TChildSelectorProps) => {
  return (
    <>
      <div className="mt-2">
        <SelectOutlet
          label={`بازه سنی کودک ${PersianIndexNumber[index]}`}
          name={`child-${index}`}
          options={
            hotelPassengerConfig?.ageType?.map((item) => ({
              value: item,
              label: childTypeConvertor[item],
            })) as Array<IOption>
          }
          value={value}
          errors={!value ? 'سن کودک الزامی است.' : undefined}
          selectAge={selectAge}
        />
      </div>
    </>
  );
};

export default ChildSelector;
