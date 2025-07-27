import { handleCallbackURL } from './handleCallbackURL';
import { createPaymentOrder } from 'services/general/payment';
import { THandlePaymentByGatewayArgs } from './handlePaymentByGateway';

export const payByIPG = async ({
  orderJWT,
  selectedGateway,
  isPartial,
  paymentData,
}: THandlePaymentByGatewayArgs) => {
  if (!isPartial) {
    paymentData = await createPaymentOrder({
      payload: {
        orderId: orderJWT,
        gatewayId: selectedGateway.id,
        callback: handleCallbackURL(),
      },
    });
  }

  // FIXME check if this refId param is required
  if (paymentData) {
    const { refId, paymentGateway } = paymentData;

    window.location.assign(`${paymentGateway}?RefId=${refId}`);
  }
};
