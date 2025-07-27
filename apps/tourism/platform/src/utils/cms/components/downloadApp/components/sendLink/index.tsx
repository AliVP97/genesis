import { QrCode } from 'assets/icons';
import cn from 'classnames';
import Modal from 'components/modal';
import Spinner from 'components/spinner';
import {
  BtnIsValid,
  IsPhoneNumberValid,
  sendLinkDeviceDetector,
} from 'containers/landingPage/utility/helper';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';

import { toast } from 'react-toastify';
import { sendLink } from 'services/landing/downloadLink';
import style from '../../download.module.scss';
import Qr from '../qr';
export const SendDownloadLink = () => {
  const [phone, setPhoneNumber] = useState<string>('');
  const [showQr, setShowQr] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ phoneNumber, device }: { phoneNumber: string; device: string }) => {
      return sendLink(phoneNumber, device);
    },
  });

  const submitHandle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        phoneNumber: phone,
        device: sendLinkDeviceDetector(),
      },
      {
        onSuccess: () => {
          toast.error('لینک با موفقیت ارسال گردید');
        },
        onError: () => {
          toast.error('خطا در ارسال لینک');
        },
      },
    );
  };

  return (
    <>
      <div className={cn(style.download__form)}>
        <form onSubmit={(e) => submitHandle(e)}>
          <div className="input-group input-group-lg d-flex  align-items-center justify-content-center">
            <input
              maxLength={11}
              type="text"
              className={`form-control ms-2 ${IsPhoneNumberValid(phone) ? 'is-invalid' : ''}`}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              placeholder="شماره موبایل"
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ''))}
              value={phone}
            />
            <button type="submit" disabled={BtnIsValid(phone) || isLoading}>
              {isLoading ? <Spinner /> : <span> دریافت لینک</span>}
            </button>
            <div
              className={cn(
                style.download__form__qr,
                'input-group-prepend d-flex align-items-center justify-content-center',
              )}
              onClick={() => setShowQr(true)}
            >
              <QrCode />
            </div>
          </div>
        </form>
      </div>
      <Modal onClose={() => setShowQr(false)} visible={showQr}>
        <Qr close={() => setShowQr(false)} />
      </Modal>
    </>
  );
};

export default SendDownloadLink;
