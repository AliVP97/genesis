import { ArrowDownIcon } from 'assets/icons';
import CustomSelect from 'components/select';
import React from 'react';
import { TTourCalenderData } from 'services/tour/v2/detail/types';

type TSelectDate = {
  calenderData: TTourCalenderData[] | undefined;
  handleUpdateCalenderState: (id: string) => void;
  defaultDate: string;
  localCalenderState: string;
};
const SelectDate = ({
  calenderData,
  handleUpdateCalenderState,
  defaultDate,
  localCalenderState,
}: TSelectDate) => {
  return (
    <CustomSelect
      field={{ name: `select`, value: localCalenderState || defaultDate }}
      label={`انتخاب تاریخ تور`}
      options={calenderData as { value: string; label: string }[]}
      // options={filteredCalenderData}
      suffix={<ArrowDownIcon />}
      hotelClassName
      onChange={(selectedOption) => handleUpdateCalenderState(selectedOption.value)}
      errorText={'خطا'}
      isError={false}
    />
  );
};

export default SelectDate;
