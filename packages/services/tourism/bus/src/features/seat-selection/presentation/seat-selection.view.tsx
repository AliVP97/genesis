import { FC, useEffect } from 'react';

import { Presenter } from './seat-selection.presenter';

export const View: FC<Presenter> = ({
  formHandler,
  selectedSeats,
  seatList,
  loadSeatList,
}) => {
  useEffect(() => {
    loadSeatList();
  }, []);

  return (
    <div>
      <h1>Bus Seat Selection</h1>
      <div>Selected Seats: {selectedSeats.join(', ')}</div>
      <form
        {...formHandler}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {seatList.busMap.map(({ seat }) =>
          seat.map(({ seatNumber, availability }, index) => (
            <label key={`${seatNumber}-${index}`}>
              <input
                type="checkbox"
                value={seatNumber}
                disabled={seatNumber === 0}
              />
              {seatNumber} - {availability}
            </label>
          )),
        )}
      </form>
    </div>
  );
};
