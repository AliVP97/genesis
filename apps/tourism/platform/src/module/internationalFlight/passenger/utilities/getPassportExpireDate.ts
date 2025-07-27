import { TPassengerV2 } from 'services/general/passenger/interface';

export default function getPassportExpireDate(passenger: TPassengerV2) {
  if (passenger.passportExpireDateString) {
    return passenger.passportExpireDateString;
  }

  const date = new Date(Number(passenger.passportExpireDate) * 1000);

  if (isNaN(date.getTime())) {
    return '-';
  }

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
