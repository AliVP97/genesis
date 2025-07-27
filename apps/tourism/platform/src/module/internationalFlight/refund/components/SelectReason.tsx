import useSelectReason from '../hooks/useSelectReason';
import { RefundReason } from '../types/api';
import Button from './Button';
import RadioButtonGroup from './RadioButtonGroup';
import Title from './TitleText';
import DesktopModalFooter from './DesktopModalFooter';

export type SelectReasonProps = {
  reasons: RefundReason[];
};

const SelectReason = () => {
  const { data, isMobile, checkedIndex, handleSubmit, handleCancel, handleCheckedIndexChange } =
    useSelectReason();

  return (
    <>
      <div className="overflow-auto h-100 d-flex flex-column p-3">
        <Title>لطفا دلیل استرداد خود را انتخاب نمایید</Title>
        <RadioButtonGroup data={data} value={checkedIndex} onChange={handleCheckedIndexChange} />
        <div className="mb-3"></div>
        {isMobile && (
          <Button className="mt-auto mb-3" onClick={handleSubmit}>
            تایید و ادامه
          </Button>
        )}
      </div>
      {!isMobile && (
        <DesktopModalFooter>
          <Button variant="outlined" onClick={handleCancel}>
            انصراف
          </Button>
          <Button onClick={handleSubmit} className="me-2">
            تایید و ادامه
          </Button>
        </DesktopModalFooter>
      )}
    </>
  );
};

export default SelectReason;
