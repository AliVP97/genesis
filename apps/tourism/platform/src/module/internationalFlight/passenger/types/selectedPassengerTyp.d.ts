interface ISelectedPassengerType {
  count: number;
  type: string;
}

interface IPassengerNumbers {
  adult: number;
  child: number;
  infant: number;
  total?: number;
}

interface IPassengerValidity {
  isValid: boolean;
  message: string;
}
