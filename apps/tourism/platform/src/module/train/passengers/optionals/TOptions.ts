export type SelectedOptions = {
  passengerId: string;
  passengerName: string;
  optionalServiceId: string;
  freeOptionalServices: string[];
};

export type OptionalServiceSubmit = {
  departure: SelectedOptions[] | false;
  arrival: SelectedOptions[] | false;
};
