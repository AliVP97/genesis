export interface IProps {
  originLocation?: string;
  destinationLocation?: string;
  dateFrom: number | null;
}

export const isDisable = ({ originLocation, destinationLocation, dateFrom }: IProps) => {
  return !originLocation || !destinationLocation || !dateFrom;
};
