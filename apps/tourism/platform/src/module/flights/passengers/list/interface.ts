export enum Select {
  WithPassport = 'passport',
  WithNationalCode = 'nationalCode',
}

export interface IPassengersType {
  type: 'adult' | 'infant' | 'child' | 'new';
  number: number;
  id: string;
}
