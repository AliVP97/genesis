import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { notify } from 'utils/notification';

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload.status == 401) {
      return next(action);
    }
    const msg = 'خطایی سمت سرور رخ داده است';
    if (action.payload.status >= 500) {
      notify({
        type: 'error',
        message: msg,
        config: {
          position: 'bottom-center',
        },
      });
    }
    if (action.payload.status < 500 && action.payload.status >= 400) {
      let lmsg = '';
      //@ts-ignore
      action.payload.data.details.forEach((detail) => {
        const e = detail['@type'];
        if (e.includes('Localized')) {
          lmsg = detail.message;
        }
      });

      notify({
        type: 'error',
        message: lmsg ? lmsg : msg,
        config: {
          position: 'bottom-center',
        },
      });
    }
  }

  return next(action);
};
