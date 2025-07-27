import { handleCallbackURL } from './handleCallbackURL';
import { createPaymentOrder } from 'services/general/payment';
import { encryptString } from 'utils/helpers/tokens';
import { THandlePaymentByGatewayArgs } from './handlePaymentByGateway';

export const payByMPG = async ({
  orderId,
  orderJWT,
  selectedGateway,
  isPartial,
  paymentData,
}: THandlePaymentByGatewayArgs) => {
  localStorage.setItem('paymentType', 'tourism');
  if (!isPartial) {
    paymentData = await createPaymentOrder({
      payload: {
        orderId: orderJWT,
        gatewayId: selectedGateway.id,
        callback: handleCallbackURL(orderId),
      },
    });
  }
  sessionStorage.setItem(
    'RECENT_PAGE',
    `${window?.location.pathname.split('/').slice(2).join('/')}`,
  );
  sessionStorage.setItem('paymentData', encryptString(JSON.stringify(paymentData)));
  window?.location.assign(
    `/transition/payment?type=tourism-payment&callback=${encodeURIComponent(
      handleCallbackURL(orderId),
    )}`,
  );
};
