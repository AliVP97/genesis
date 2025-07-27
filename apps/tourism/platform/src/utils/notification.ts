import { ReactElement } from 'react';

import { toast, ToastOptions, TypeOptions } from 'react-toastify';

interface Props {
  type?: TypeOptions;
  message?: string | ReactElement;
  config?: ToastOptions;
}

const DEFAULT_MESSAGES: Record<TypeOptions, string> = {
  success: 'عملیات با موفقیت انجام شد',
  error: 'مشکلی رخ داده است',
  info: 'اطلاعات با موفقیت بروز شد',
  warning: 'مشکلی رخ داده است',
  default: 'عملیات با موفقیت انجام شد',
};

const getDefaultOptions = (type: TypeOptions): ToastOptions => ({
  bodyClassName: type === 'warning' ? 'notification--warn' : '',
  className: type === 'warning' ? 'notification--warn--wrapper' : 'notification',
  position: toast.POSITION.BOTTOM_RIGHT,
  rtl: false,
  autoClose: 5000,
  draggable: true,
  hideProgressBar: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
});

export const notify = ({ type = 'default', message = '', config }: Props) => {
  if (!message) {
    message = DEFAULT_MESSAGES[type];
  }

  return toast(message, { type, ...getDefaultOptions(type), ...config });
};
