import AddPassengerForm from 'containers/passengers/form';
import cn from 'classnames';
import { useRef, useState } from 'react';
import UseAddPassenger from 'module/internationalFlight/passenger/hooks/useAddPassenger';
import styles from './addForm.module.scss';
import Divider from 'components/divider';
import Spinner from 'components/spinner';
import { addPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import { FromSchema } from '../../../../../../containers/passengers/utilities/types';
import { validations } from '../../../../../train/passengers/form/validations';

type TAddFormProps = {
  getPassengers: () => void;
};

const AddForm = ({ getPassengers }: TAddFormProps) => {
  const [showAdd, setShowAdd] = useState<boolean>(false);
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
  const onSubmit = (data: Record<string, string | number | undefined>) => {
    addAddPassenger(addPassengerMapper(data));
  };
  const handelClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <div className={styles['add-btn']}>
        {!showAdd && (
          <div
            className={cn('py-4 d-flex justify-content-center')}
            onClick={() => setShowAdd(true)}
          >
            <button className={styles['add-btn__more']}>افزودن مسافر جدید</button>
          </div>
        )}

        {showAdd && (
          <>
            {/*<div className=" d-flex ps-4 pt-3 justify-content-end d-none">*/}
            {/*  <span className="ms-2 text-3"> تاریخ میلادی</span>*/}
            {/*  <SwitchButton*/}
            {/*    defaultChecked={!isJalaliBirthdate}*/}
            {/*    onChange={handleJalaliChange}*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="d-none d-md-block">
              <div className="container mt-4">
                <AddPassengerForm
                  forms={dynamicForms}
                  onSubmit={onSubmit}
                  showSubmit={false}
                  ref={formRef}
                  isSubmitSuccessful={isSuccess}
                  btnValue="افزودن مسافر جدید"
                  loading={isLoading}
                />
              </div>
            </div>
            <div className="mt-2">
              <Divider type="horizontal" />
              <div className="w-100 d-flex justify-content-end">
                <button
                  className={cn(styles['add-btn__submit'], 'btn py-3 ms-4 color-primary')}
                  onClick={handelClick}
                >
                  <>{isLoading ? <Spinner /> : <span> تایید و ذخیره</span>}</>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AddForm;
