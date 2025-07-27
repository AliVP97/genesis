import { PassengerPayload, TPassengerType } from 'services/general/passenger/interface';
import { ResultProps } from 'module/flights/passengers/tabSelect/interface';

export const updateLocalStorage = (payload: TPassengerType) => {
  let oldPassengers = JSON.parse(localStorage.getItem('passengers') as string);
  const editDataIndex = oldPassengers?.findIndex(
    (item: ResultProps) =>
      (item.nationalId === payload.nationalId) !== undefined ||
      (item.passportId === payload.passportId) !== undefined,
  );
  const isEditing = !!oldPassengers?.filter((item: ResultProps) => {
    if (payload.nationalId && item.nationalId === payload.nationalId) return item;
    if (payload.passportId && item.passportId === payload.passportId) return item;
  }).length;
  if (isEditing) {
    oldPassengers[editDataIndex] = payload;
    localStorage.setItem('passengers', JSON.stringify([...oldPassengers]));
  } else {
    oldPassengers = oldPassengers
      ? [
          ...oldPassengers,
          {
            ...payload,
            id: payload.passportId ? payload.passportId : payload.nationalId,
          },
        ]
      : [
          {
            ...payload,
            id: payload.passportId ? payload.passportId : payload.nationalId,
          },
        ];
    localStorage.setItem('passengers', JSON.stringify(oldPassengers));
  }
  return oldPassengers;
};

export const deleteLocalStorage = (id: string) => {
  let oldPassengers = JSON.parse(localStorage.getItem('passengers') as string);
  oldPassengers = oldPassengers.filter((item: PassengerPayload['body']) => item.id !== id);
  localStorage.setItem('passengers', JSON.stringify(oldPassengers));
  return oldPassengers;
};
