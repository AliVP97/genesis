import RadioButtonGroup from './RadioButtonGroup';
import useSelectPath from '../hooks/useSelectPath';
import TitleText from './TitleText';
import Button from './Button';
import DesktopModalFooter from './DesktopModalFooter';

const SelectPath = () => {
  const { data, isMobile, handleSubmit, handleCancel, checkedIndex, handleCheckedIndexChange } =
    useSelectPath();

  return (
    <>
      <div className="overflow-auto h-100 d-flex flex-column p-3">
        <TitleText>لطفا مسیر مورد نظر را برای استرداد انتخاب نمایید</TitleText>
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

export default SelectPath;
