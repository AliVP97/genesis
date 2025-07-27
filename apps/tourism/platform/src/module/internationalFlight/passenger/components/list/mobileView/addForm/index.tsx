import Modal from 'components/modal';
import AddPassengerForm from 'containers/passengers/form';
import UseAddPassenger from 'module/internationalFlight/passenger/hooks/useAddPassenger';
import Header from '../header';

import { useEffect, useRef } from 'react';
import { addPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import Button from 'components/button';
import { FromSchema } from '../../../../../../../containers/passengers/utilities/types';
import { validations } from '../../../../../../train/passengers/form/validations';

type TAddFormProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  getPassengers: () => void;
};
const AddForm = ({ setShowForm, showForm, getPassengers }: TAddFormProps) => {
  const { addAddPassenger, isSuccess, isLoading } = UseAddPassenger(getPassengers);
  const formRef = useRef<HTMLFormElement>(null);
  // TODO : this array is duplicated it should be one
  const dynamicForms: Array<Array<FromSchema>> = [
    [
      {
        name: 'englishName',
        label: 'نام لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        rules: validations.LatinFirstName,
        visible: true,
        upperCase: true,
      },
      {
        name: 'englishFamily',
        label: 'نام خانوادگی لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        rules: validations.LatinLastName,
        visible: true,
        upperCase: true,
      },
      {
        name: ['BirthDay', 'BirthMonth', 'BirthYear'],
        label: 'تاریخ تولد',
        type: 'timeSelector',
        isJalali: false,
        rules: {
          required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
        },
        visible: true,
      },
      {
        name: 'gender',
        label: 'جنسیت',
        type: 'genderSelector',
        rules: validations.Gender,
        visible: true,
      },

      {
        name: 'passportId',
        label: 'شماره پاسپورت',
        type: 'text',
        placeholder: '',
        rules: validations.PassportNumber,
        visible: true,
      },
      {
        name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
        label: 'تاریخ انقضای پاسپورت',
        type: 'timeSelector',
        isJalali: false,
        rules: {
          required: {
            value: true,
            message: 'تاریخ انقضای پاسپورت الزامی می باشد',
          },
        },
        visible: true,
      },
      {
        name: 'passportCountry',
        label: 'کشور صادر کننده پاسپورت',
        type: 'countrySelector',
        placeholder: '',
        rules: validations.PassportCountry,
        visible: true,
      },

      {
        name: 'nationalId',
        label: 'کد ملی',
        type: 'text',
        inputMode: 'numeric',
        placeholder: '',
        rules: validations.NationalCode,
        visible: false,
      },
    ],
  ];
  const onsubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(addPassengerMapper(data));
  };

  useEffect(() => {
    setShowForm(false);
  }, [isSuccess]);

  const handelClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Modal visible={showForm} onClose={() => setShowForm(false)}>
        <div className="bg-color-white w-100 h-100 position-fixed overflow-auto">
          <Header title="افزودن مسافر جدید" setShow={setShowForm} />{' '}
          {/*<div className=" d-flex ps-4 pt-3 d-none">*/}
          {/*  <SwitchButton*/}
          {/*    defaultChecked={!isJalaliBirthdate}*/}
          {/*    onChange={handleJalaliChange}*/}
          {/*  />{' '}*/}
          {/*  <span className="ms-2 text-3"> تاریخ میلادی</span>*/}
          {/*</div>*/}
          <div className="p-4">
            <AddPassengerForm
              forms={dynamicForms}
              onSubmit={onsubmit}
              btnValue={'افزودن مسافر'}
              showSubmit={false}
              loading={isLoading}
              ref={formRef}
            />
          </div>
          <div className="px-3 mb-4">
            <Button
              radius
              className="btn btn-primary me-2 px-5 w-100"
              btnType="button"
              onClick={handelClick}
            >
              افزودن مسافر{' '}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddForm;
