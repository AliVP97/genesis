import { FunctionComponent, useEffect } from 'react';

import { PassengerListMobile } from './PassengerList.mobile';
import { PassengerListDesktop } from './PassengerList.desktop';

import { usePassengersList } from './usePassengersList';
import { InvalidPassengerNotification } from './components/invalidPassengerNotification';
import { NationalityNotification } from './components/nationalityNotification';

import Modal from 'components/modal';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { BusTrackingEvent } from 'utils/ecommerce/application/mappers/bus/event';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';

export type PassengerListProps = {
  isLoggedIn?: boolean;
  containerSize?: string;
  title?: string;
  description?: string;
  singleSelect?: boolean;
};

export const PassengersList: FunctionComponent<PassengerListProps> = (props) => {
  const handler = usePassengersList(!!props.singleSelect);

  const { busData } = useSelector((state: RootState) => state?.ecommerceReducer?.ecomerceSlice);
  useEffect(() => {
    if (busData) {
      const busEvent = new BusTrackingEvent();
      busEvent.beginCheckout(busData as busViewListItemModel);
    }
  }, []);

  return (
    <>
      {handler.isMobile ? (
        <PassengerListMobile {...handler} {...props} />
      ) : (
        <PassengerListDesktop {...handler} {...props} />
      )}
      {/* nationality notification modal: */}
      <Modal
        onClose={handler.handleNationalityNotificationModalOnClose}
        visible={handler.nationalityNotificationModalIsVisible}
      >
        <NationalityNotification onConfirm={handler.handleNationalityNotificationModalOnClose} />
      </Modal>
      {/* passenger invalid info notification modal: */}
      <Modal
        onClose={handler.handleInvalidPassengerNotificationModalOnClose}
        visible={handler.passengerInvalidInfoNotificationModalIsVisible}
      >
        <InvalidPassengerNotification
          onClose={handler.handleInvalidPassengerNotificationModalOnClose}
          onConfirm={handler.handleInvalidPassengerNotificationOnConfirm}
        />
      </Modal>
    </>
  );
};
