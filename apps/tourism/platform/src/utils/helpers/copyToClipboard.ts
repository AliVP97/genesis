import { ToastOptions, toast } from 'react-toastify';

type TCopyToClipboardOptions = {
  hasNotification?: boolean;
  successMessage?: string;
  failedMessage?: string;
  toastOptions?: ToastOptions;
};

type TCopyToClipboardFunction = (value: string, options?: TCopyToClipboardOptions) => void;

export const copyToClipboard: TCopyToClipboardFunction = (
  value,
  options = {
    hasNotification: true,
    successMessage: 'کپی با موفقیت انجام شد',
    failedMessage: 'کپی موفقیت‌آمیز نبود',
    toastOptions: { autoClose: 1500 },
  },
) => {
  const { hasNotification, successMessage, failedMessage, toastOptions } = options;

  typeof window !== 'undefined' &&
    window.navigator.clipboard
      .writeText(value)
      .then(() => {
        hasNotification && successMessage && toast.success(successMessage, toastOptions);
      })
      .catch(() => {
        hasNotification && failedMessage && toast.error(failedMessage, toastOptions);
      });
};
