import { BusSeatsResponse, TSeat } from 'services/bus/seats/interface';

export const useGetBusSeatsMatrix = (busSeatsData: BusSeatsResponse) => {
  const x = busSeatsData?.busMap![0].row;
  const y = busSeatsData?.busMap![0].column;

  const seatsMatrix: TSeat[][] = Array.from({ length: x! }, () => Array(y!).fill(0));

  for (let i = 0; i <= x! - 1; i++) {
    for (let j = 0; j <= y! - 1; j++) {
      const newSeat: TSeat = { availability: '', seatNumber: undefined };
      seatsMatrix[i][j] = newSeat;
    }
  }

  busSeatsData?.busMap![0].seat?.map((item) => {
    seatsMatrix[item.y! - 1][item.x! - 1].availability = item.availability as string;
    seatsMatrix[item.y! - 1][item.x! - 1].seatNumber = item.seatNumber;
  });

  return { seatsMatrix };
};
