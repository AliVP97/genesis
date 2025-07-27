import Button from 'components/button';
import Modal from 'components/modal';
import { useRouter } from 'next/router';
import { THotelRefundable } from 'services/hotel/refund/interface';

type TCheckHotelRefundableProps = {
  refundError: boolean;
  hotelRefund?: THotelRefundable;
  setRefundError: React.Dispatch<React.SetStateAction<boolean>>;
};

const CheckHotelRefundable = ({
  refundError,
  setRefundError,
  hotelRefund,
}: TCheckHotelRefundableProps) => {
  const { push } = useRouter();
  return (
    <>
      {refundError && (
        <Modal
          visible={refundError}
          onClose={() => setRefundError(false)}
          backdropDisable={false}
          className="stop-scrolling"
        >
          <div className="bg-color-surface p-4 rounded mx-5">
            <p className="text-justify color-on-surface rtl">{hotelRefund?.message}</p>

            <div className=" mt-4">
              <Button
                radius
                className="bg-color-primary color-on-primary px-4"
                onClick={() => {
                  setRefundError(false);
                  push('/profile/travels');
                }}
              >
                متوجه شدم
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CheckHotelRefundable;
