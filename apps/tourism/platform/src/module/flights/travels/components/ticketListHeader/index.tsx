import { ExpandedDetail } from 'assets/icons';
import Spinner from 'components/spinner';
import React from 'react';
import { TTripTypes } from 'services/domestic/orders/interface';

type TravelTicketHeaderProp = {
  title: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  orderId: string;
  type?: TTripTypes;
  getOrderDetails: (orderId: string, type?: TTripTypes) => void;
  loading: boolean;
};

const TravelTicketHeader = ({
  open,
  title,
  setOpen,
  getOrderDetails,
  orderId,
  type,
  loading,
}: TravelTicketHeaderProp) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <span className="text-weight-500">{title}</span>
        <div
          className="text-end"
          onClick={() => {
            setOpen(!open);
            getOrderDetails(orderId, type);
          }}
        >
          {loading ? (
            <div className="ms-3 mt-2">
              <Spinner />
            </div>
          ) : (
            <>
              <span className="text-2 color-grey-1"> جزییات </span>
              <ExpandedDetail />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TravelTicketHeader;
