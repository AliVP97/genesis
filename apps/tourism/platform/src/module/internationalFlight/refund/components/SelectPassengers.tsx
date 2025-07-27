import useSelectPassengers from '../hooks/useSelectPassengers';
import FlightDetails from './FlightDetails';
import PassengersMultiSelect from './PassengersMultiSelect';
import Button from './Button';
import Dialog from './Dialog';
import DesktopModalFooter from './DesktopModalFooter';

const SelectPassengers = () => {
  const {
    isMobile,
    canSubmit,
    dialogState,
    handleCancel,
    handleSubmit,
    checkedIndexes,
    handleDialogClose,
    handleChangeCheckedIndexes,
  } = useSelectPassengers();

  return (
    <>
      <div className="overflow-auto h-100 d-flex flex-column p-3">
        <div className="d-flex flex-column gap-3 mb-3">
          <FlightDetails />
          <PassengersMultiSelect value={checkedIndexes} onChange={handleChangeCheckedIndexes} />
        </div>
        {isMobile && (
          <Button className="mt-auto mb-3" onClick={handleSubmit} disabled={!checkedIndexes.length}>
            تایید و ثبت استرداد
          </Button>
        )}
      </div>
      {!isMobile && (
        <DesktopModalFooter>
          <Button variant="outlined" onClick={handleCancel}>
            انصراف
          </Button>
          <Button onClick={handleSubmit} className="me-2" disabled={!canSubmit}>
            تایید و ثبت استرداد
          </Button>
        </DesktopModalFooter>
      )}
      {dialogState && (
        <Dialog
          onClose={handleDialogClose}
          status={dialogState.status}
          messages={dialogState.messages}
        />
      )}
    </>
  );
};

export default SelectPassengers;
