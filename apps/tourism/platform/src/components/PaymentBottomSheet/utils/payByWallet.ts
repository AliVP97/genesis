import { handlePaymentByGateway, THandlePaymentByGatewayArgs } from './handlePaymentByGateway';
import { handleCallbackURL } from './handleCallbackURL';
import { sendWalletOrder } from 'services/general/payment';
import { TGateway } from 'components/DynamicGateways';

export const payByWallet = async ({
  orderId,
  orderJWT,
  selectedGateway,
}: THandlePaymentByGatewayArgs) => {
  const walletPaymentResponse = await sendWalletOrder({
    payload: {
      orderId: orderJWT,
      gatewayId: selectedGateway.id,
      callback: handleCallbackURL(),
    },
  });

  if (walletPaymentResponse.OrderId) {
    if (walletPaymentResponse.paymentMethod?.toLowerCase() === 'wallet') {
      window.location.assign(
        handleCallbackURL(
          walletPaymentResponse.OrderId,
          walletPaymentResponse.MapData?.serviceName,
        ),
      );
    } else {
      const { refId, price, paymentGateway, otp, OrderId, paymentMethod } = walletPaymentResponse;
      await handlePaymentByGateway({
        orderJWT,
        selectedGateway: walletPaymentResponse as TGateway,
        orderId,
        isPartial: true,
        paymentData: {
          refId,
          price: Number(price),
          paymentGateway,
          otp,
          orderId: OrderId,
          paymentMethod,
        },
      });
    }
  }
  return walletPaymentResponse;
};
