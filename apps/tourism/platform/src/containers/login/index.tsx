import { useEffect, useState } from 'react';

import cn from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import classNames from 'classnames';
import { useMutation } from 'react-query';
import jwt_decode from 'jwt-decode';

import Button from 'components/button';
import LoginInput from 'components/login-input';
import ConfirmInput from 'components/confirmInput';
import { MobileFormProps } from './interface';
import Countdown from 'components/countdown';
import { BackArrowIcon, CloseIcon, LoginBanner } from 'assets/icons';
import { removeCookie, setCookie } from 'utils/helpers/coockieHelper';
import { notify } from 'utils/notification';
import { validationMobile } from 'utils/helpers/validations';
import Modal from 'components/modal';
import { useAuthContext } from 'utils/hooks/useAuthContext';
import { register, confirm } from 'services/general/login';
import { ConfirmRequest } from 'services/general/login/interface';
import { encryptTokens } from 'utils/helpers/tokens';
import { fixNumbers } from 'utils/helpers/numbers';

import styles from './login.module.scss';

enum Direction {
  RTL = 'right',
  LTR = 'left',
  CENTER = 'center',
}

const LoginContainer = () => {
  const { visible, closable, setUserLogin, handleModalClose } = useAuthContext();
  const [loginState, setLoginState] = useState({ phoneNumber: '' });
  const [confirmStep, setConfirmStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [isConfirmError, setIsConfirmError] = useState(false);
  const {
    handleSubmit,
    control,
    setFocus,
    resetField,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<MobileFormProps>({
    mode: 'all',
    defaultValues: { phoneNumber: '' },
  });
  const {
    mutate: registerMutate,
    isSuccess: isRegisterSuccess,
    data: registerResult,
  } = useMutation(
    (phoneNumber: string) => {
      return register(fixNumbers(phoneNumber));
    },
    {
      onError: (error: { response: { data: { message: string } } }) => {
        notify({
          type: 'error',
          message: <span>{error.response.data.message}</span>,
          config: {
            position: 'bottom-center',
            hideProgressBar: true,
            draggable: false,
          },
        });
      },
    },
  );

  const {
    mutate: confirmMutate,
    isSuccess: isConfirmSuccess,
    data: confirmResult,
    error: confirmError,
  } = useMutation(
    (options: ConfirmRequest) => {
      options.code = fixNumbers(options.code);
      options.phonNumber = fixNumbers(options.phonNumber);
      options.headers.mobile_no = fixNumbers(options.headers.mobile_no);
      return confirm(options);
    },
    {
      onSuccess: () => {
        removeCookie('guest_access_token');
        removeCookie('guest_refresh_token');
      },
      onError: (error: { response: { data: { message: string } } }) => {
        notify({
          type: 'error',
          message: (
            <span className="text-2 color-error text-center mt-2 text-black">
              {error.response.data.message}
            </span>
          ),
          config: {
            position: 'bottom-center',
            hideProgressBar: true,
            draggable: false,
          },
        });
      },
    },
  );

  useEffect(() => {
    if (loginState.phoneNumber.length === 11) {
      registerMutate(loginState.phoneNumber);
      setLoading(true);
    }
  }, [loginState]);

  useEffect(() => {
    if (isRegisterSuccess) {
      setConfirmStep(true);
      setLoading(false);
    }
    if (isRegisterSuccess) {
      setLoading(false);
    }
  }, [registerResult]);

  useEffect(() => {
    if (isConfirmSuccess) {
      setCookie(
        'mobile',
        (jwt_decode(confirmResult!.access_token) as { mobile?: string }).mobile || '-',
        confirmResult!.access_expire_time,
      );
      if (typeof window !== 'undefined') {
        localStorage.setItem('UATP', confirmResult!.access_token);
        localStorage.setItem('UFTP', encryptTokens(confirmResult!.refresh_token));
        localStorage.setItem('ST', confirmResult!.sign_token);
      }

      setUserLogin();
    }
    if (confirmError) {
      setIsConfirmError(true);
    }
  }, [confirmResult]);

  const handleClearInput = () => {
    resetField('phoneNumber');
    clearErrors('phoneNumber');
    setFocus('phoneNumber');
  };

  const onSubmit = ({ phoneNumber }: MobileFormProps) => {
    setLoginState({ phoneNumber });
  };

  const onSubmitConfirmCode = (code: string) => {
    confirmMutate({
      headers: {
        mobile_no: loginState.phoneNumber,
      },
      phonNumber: loginState.phoneNumber,
      code,
    });
  };

  const onFinishCountdown = () => {
    setShowCountdown(false);
  };

  return (
    <Modal visible={visible} onClose={() => ({})} backdropDisable={true}>
      <div className={cn(styles.login, 'flex-column pt-4 pb-2 px-3 text-center')}>
        <div
          className={classNames(
            styles.close__modal,
            'my-3 text-start d-flex justify-content-between',
          )}
        >
          {closable && <CloseIcon className="ms-2" onClick={handleModalClose} />}
          {confirmStep && <BackArrowIcon onClick={() => setConfirmStep(false)} />}
        </div>
        <div className={classNames(styles.login__logo, 'my-3')}>
          <LoginBanner className="fill-tertiary" />
        </div>
        <div className="d-md-none mb-3 mt-3">
          <span>جهت ادامه فرایند خرید، لطفا وارد شوید</span>
        </div>
        {!confirmStep ? (
          <>
            <h4 className="text-3 mb-4">برای ورود شماره تلفن خود را وارد کنید</h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="d-flex flex-column flex-1 flex-grow-1 justify-content-between"
            >
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: true,
                  maxLength: 11,
                  validate: (value: string) =>
                    validationMobile(value) || 'شماره موبایل صحیح نمیباشد',
                }}
                render={({ field }) => (
                  <LoginInput
                    dir={Direction.CENTER}
                    inputMode="tel"
                    label="شماره موبایل"
                    isError={!!errors.phoneNumber}
                    onClear={handleClearInput}
                    field={field}
                    maxLength={11}
                    errorText="شماره موبایل صحیح نمیباشد"
                  />
                )}
              />

              <div className="d-none d-md-block mb-3 mt-3">
                <span>
                  استفاده از خدمات هف‌هشتاد به معنی پذیرش
                  <span>
                    <a href={`${process.env.NEXT_PUBLIC_DOMAIN}page/tourism-terms`}>
                      {' '}
                      قوانین و مقررات
                    </a>{' '}
                    این سامانه است
                  </span>
                </span>
              </div>

              <div className="d-none d-md-flex justify-content-md-center align-items-md-center mt-2">
                <Button
                  btnType="submit"
                  disabled={!isValid}
                  loading={loading}
                  className={cn(styles.login__button, 'btn btn-primary d-block')}
                >
                  دریافت کد فعال سازی
                </Button>
              </div>

              <Button
                btnType="submit"
                disabled={!isValid}
                loading={loading}
                className={cn(styles.login__button, 'btn btn-primary d-block d-md-none')}
              >
                دریافت کد فعال سازی
              </Button>
            </form>
          </>
        ) : (
          <>
            <h4 className="text-3 mb-4">
              کد فعال سازی ارسال شده به شماره <span>{loginState.phoneNumber}</span> را وارد کنید
            </h4>
            <ConfirmInput
              error={isConfirmError}
              count={registerResult?.len}
              onSubmit={onSubmitConfirmCode}
            />

            <div className="d-flex align-items-center mx-auto mt-5">
              {showCountdown ? (
                <>
                  <span className="me-2 text-3 text-weight-500">ارسال مجدد کد‌فعال‌سازی</span>
                  <Countdown duration={120} onFinish={onFinishCountdown} resetTime={false} />
                </>
              ) : (
                <div className="text-3 color-primary text-weight-500 d-flex flex-column">
                  <span
                    className="mb-3"
                    onClick={() => {
                      setLoading(true);
                      registerMutate(loginState.phoneNumber);

                      setShowCountdown(true);
                      setIsConfirmError(false);
                    }}
                  >
                    ارسال مجدد کد‌فعال‌سازی
                  </span>
                  <span dir="rtl">
                    دریافت کد فعالسازی با شماره گیری <span>#۷۸۰*</span>
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default LoginContainer;
