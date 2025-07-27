import EditPassengerForm from 'containers/passengers/edit';
import { validations } from 'module/flights/passengers/form/validations';
import UseEditPassenger from 'module/internationalFlight/passenger/hooks/useUpdatePassenger';
import { PassengerV2EditPayload, TPassengerV2 } from 'services/general/passenger/interface';
import styles from './edit.module.scss';
import { useEffect, useRef } from 'react';
import { Edit } from 'assets/icons';
import Button from 'components/button';
import Divider from 'components/divider';
import { addPassengerMapper } from 'module/internationalFlight/passenger/utilities/helper';
import { FromSchema, ISelectedCountry } from 'containers/passengers/utilities/types';
import { normalizeEditPassengerPayload } from 'module/flights/travels/components/passengers/list/edit/utils/normalizeEditPassengerPayload';
// import SwitchButton from '../../../../../../components/switchButton';

type TEditPassengerProps = {
  passenger: TPassengerV2;
  getPassengers: () => void;
  setEditModal: (e: boolean) => void;
};

const EditPassenger = ({ passenger, getPassengers, setEditModal }: TEditPassengerProps) => {
  const { editPassenger, isLoading, isSuccess } = UseEditPassenger(getPassengers);
  // const [isJalaliBirthdate, setIsJalaliBirthdate] = useState<boolean>(true);
  // TODO : this array is duplicated it should be one
  const dynamicForms: Array<Array<FromSchema>> = [
    [
      {
        name: 'englishName',
        label: 'نام لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        defaultValue: passenger.englishName,
        rules: validations.LatinFirstName,
        visible: true,
        upperCase: true,
      },
      {
        name: 'englishFamily',
        label: 'نام خانوادگی لاتین (مطابق با پاسپورت)',
        type: 'text',
        placeholder: '',
        defaultValue: passenger?.englishFamily,
        rules: validations.LatinLastName,
        visible: true,
        upperCase: true,
      },
      {
        name: ['BirthDay', 'BirthMonth', 'BirthYear'],
        label: 'تاریخ تولد',
        type: 'timeSelector',
        // isJalali: isJalaliBirthdate,
        defaultValue: passenger.birthday != '0' ? passenger.birthday : '',
        rules: {
          required: { value: true, message: 'تاریخ تولد الزامی می باشد' },
        },
        visible: true,
      },
      {
        name: 'gender',
        label: 'جنسیت',
        type: 'genderSelector',
        defaultValue: passenger?.gender,
        rules: validations.Gender,
        visible: true,
      },
      {
        name: 'passportId',
        label: 'شماره پاسپورت',
        type: 'text',
        placeholder: '',
        defaultValue: passenger?.passportId,
        rules: validations.PassportNumber,
        visible: true,
      },
      {
        name: ['ExpireDay', 'ExpireMonth', 'ExpireYear'],
        label: 'تاریخ انقضای پاسپورت',
        type: 'timeSelector',
        // isJalali: isJalaliBirthdate,
        defaultValue:
          Number(passenger?.passportExpireDate) > 0 ? passenger?.passportExpireDate : undefined,
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
        defaultValue:
          Number(passenger?.countryObject?.id) <= 0
            ? undefined
            : ({
                countryAlpha2: passenger?.countryObject?.countryAlpha2,
                value: passenger?.countryObject?.id,
              } as ISelectedCountry),
        rules: validations.PassportCountry || null,
        visible: true,
      },

      {
        name: 'nationalId',
        label: 'کد ملی',
        type: 'text',
        inputMode: 'numeric',
        placeholder: '',
        defaultValue: passenger?.nationalId,
        rules: validations.NationalCode,
        visible: false,
      },
    ],
  ];

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (data: Record<string, string | number>) => {
    const payload: PassengerV2EditPayload = {
      id: passenger.id || '',
      body: addPassengerMapper(data, false),
    };
    editPassenger(normalizeEditPassengerPayload(payload, passenger));
  };

  useEffect(() => {
    if (isSuccess) setEditModal(false);
  }, [isSuccess]);

  const handelClick = () => {
    formRef.current?.requestSubmit();
  };

  // const handleJalaliChange = (e: boolean) => {
  //   setIsJalaliBirthdate(!e);
  // };

  return (
    <>
      <div className={styles['edit-modal']}>
        {/*<div className="d-md-none">*/}
        {/*  <Header title="ویرایش مسافر" setShow={setEditModal} />*/}
        {/*  <div className=" d-flex ps-4 pt-3 justify-content-end">*/}
        {/*    <span className="ms-2 text-3"> تاریخ میلادی</span>*/}
        {/*    <SwitchButton*/}
        {/*      defaultChecked={!isJalaliBirthdate}*/}
        {/*      onChange={handleJalaliChange}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="d-none d-md-flex">
          <div className="col-6">
            <Edit />
            <span className="pe-2">ویرایش اطلاعات مسافر</span>
          </div>
          {/*<div className="col-6 d-flex justify-content-end">*/}
          {/*  <span className="ms-2 text-3"> تاریخ میلادی</span>*/}
          {/*  <SwitchButton*/}
          {/*    defaultChecked={!isJalaliBirthdate}*/}
          {/*    onChange={handleJalaliChange}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        <div className="p-4 pb-0">
          <EditPassengerForm
            showSubmit={false}
            forms={dynamicForms}
            ref={formRef}
            onSubmit={onSubmit}
            loading={isLoading}
            btnValue="ویرایش مسافر"
          />
          <Divider type="horizontal" />
          <div className="d-flex mt-3 justify-content-end">
            <Button
              radius
              className="btn border bg-color-white color-black  d-block px-5 ms-2"
              onClick={() => setEditModal(false)}
            >
              انصراف
            </Button>
            <Button
              radius
              onClick={handelClick}
              className="btn btn-primary d-block px-5"
              loading={isLoading}
            >
              تایید و ذخیره
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPassenger;
