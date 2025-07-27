import React, { useEffect } from 'react';
import RadioElement from 'components/radio';
import { TPathStepProps } from '../types';
import { ITripDomesticFlight } from 'module/flights/travels/interface';

export const PathStep: React.FunctionComponent<TPathStepProps> = ({
  order,
  selectedDepartureIata,
  setSelectedDepartureIata,
}) => {
  const orderDetails = order.details as ITripDomesticFlight;
  //make the first radio button checked
  useEffect(() => {
    if (
      selectedDepartureIata.iata !== (order?.return?.details as ITripDomesticFlight)?.departureIata
    ) {
      setSelectedDepartureIata({
        farsi: order.departureCity!,
        iata: orderDetails.departureIata!,
        isReturn: false,
      });
    }
  }, []);

  return (
    <div className="rtl">
      <p>لطفا مسیر مورد نظر را انتخاب کنید </p>
      <div className="w-100 pe-md-4">
        <div className="bg-color-surface rounded-pill px-4 mb-3">
          <RadioElement
            checked={selectedDepartureIata.iata === orderDetails.departureIata}
            onChange={() =>
              setSelectedDepartureIata({
                farsi: order.departureCity!,
                iata: orderDetails.departureIata!,
                isReturn: false,
              })
            }
            value={orderDetails.departureIata!}
            label={`${order.departureCity} - ${order.arrivalCity}`}
          />
        </div>

        {order.return && (
          <div className="bg-color-surface rounded-pill px-4">
            <RadioElement
              checked={
                selectedDepartureIata.iata ===
                (order.return.details as ITripDomesticFlight).departureIata
              }
              onChange={() =>
                setSelectedDepartureIata({
                  farsi: order!.return!.departureCity!,
                  iata: (order!.return!.details as ITripDomesticFlight).departureIata!,
                  isReturn: true,
                })
              }
              value={order.return.ticketId!}
              label={`${order.arrivalCity} - ${order.departureCity}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
