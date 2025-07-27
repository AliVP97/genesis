import { definitions } from 'types/payment';
import { encryptTokens } from 'utils/helpers/tokens';
export type WalletResponse = definitions['paymentOrderWalletResponse'];
export const handleSuccessWalletOrder = (
  paymentData: WalletResponse,
  orderId: string,
  paymentJwt: string,
  serviceName: string,
  phoneNumber: string,
) => {
  if (paymentData.paymentMethod === 'wallet') {
    const body = {
      ...paymentData,
      ...paymentData?.MapData,
      orderId: orderId,
      module,
    };
    sessionStorage.setItem(
      paymentData?.ReferenceId || paymentData.refId || '',
      encryptTokens({
        data: JSON.stringify(body),
      }),
    );
    if (serviceName === 'tour') {
      window.location.replace(`/tourism/receipt?serviceName=tour&orderId=${paymentData?.OrderId}`);
    } else {
      window.location.replace(
        `/tourism/${encodeURI(serviceName)}/issuance/${encodeURI(String(orderId))}`,
      );
    }
  } else {
    if (paymentData?.paymentMethod === 'ipg') {
      window.location.assign(
        `${paymentData?.paymentGateway + `?RefId=${paymentData?.refId}&MobileNo=${phoneNumber}`}`,
      );
    } else {
      sessionStorage.setItem('incoming-payment', paymentJwt as string);
      window.location.replace('/incoming-payment');
    }
  }
};
