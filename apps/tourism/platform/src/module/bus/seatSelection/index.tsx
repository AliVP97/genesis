import { FC } from 'react';

import { SeatSelectionMobile } from './SeatSelection.mobile';
import { SeatSelectionDesktop } from './SeatSelection.desktop';
import { useSeatSelection } from './useSeatSelection';
import { Device } from 'utils/interface';

type TSeatSelectionProps = {
  device: Device;
};

const SeatSelection: FC<TSeatSelectionProps> = ({ device }) => {
  const {
    isLoadingBusSeats,
    seatsMatrix,
    toggleSeatSelection,
    selectedSeats,
    showPriceDetails,
    selectedTicket,
    setShowPriceDetails,
    handleSeatConfirm,
    isSubmiting,
    busSeatsData,
  } = useSeatSelection(device);

  return device == Device.mobile ? (
    <SeatSelectionMobile
      isLoadingBusSeats={isLoadingBusSeats}
      seatsMatrix={seatsMatrix}
      toggleSeatSelection={toggleSeatSelection}
      selectedSeats={selectedSeats}
      showPriceDetails={showPriceDetails}
      selectedTicket={selectedTicket}
      setShowPriceDetails={setShowPriceDetails}
      handleSeatConfirm={handleSeatConfirm}
      isSubmiting={isSubmiting}
    />
  ) : (
    <SeatSelectionDesktop
      selectedTicket={selectedTicket}
      selectedSeats={selectedSeats}
      busSeatsData={busSeatsData}
      isLoadingBusSeats={isLoadingBusSeats}
      seatsMatrix={seatsMatrix}
      toggleSeatSelection={toggleSeatSelection}
      handleSeatConfirm={handleSeatConfirm}
      isSubmiting={isSubmiting}
    />
  );
};
export default SeatSelection;
