import { Dispatch, createContext } from 'react';
import { PassengerModel } from '../hooks/usePassenger';
import { PassengerLeader } from '../components/passengersList';
export type MoreButtonContext = {
  setEditModal?: Dispatch<React.SetStateAction<boolean>>;
  setDeleteModal?: Dispatch<React.SetStateAction<boolean>>;
  setAddModal?: Dispatch<React.SetStateAction<boolean>>;

  setSelectedPassengers?: Dispatch<React.SetStateAction<PassengerModel[]>>;

  setSelectedPassenger?: Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
    }>
  >;
  setSelectedAfterAdd?: Dispatch<React.SetStateAction<string | undefined>>;
  selectedAfterAdd?: string;
  setLeader?: React.Dispatch<React.SetStateAction<PassengerLeader | undefined>>;
  disabledPassengers?: string[];
  leader?: PassengerLeader;
  editModal?: boolean;
  addModal?: boolean;
  deleteModal?: boolean;
  selectedPassengers?: PassengerModel[];
  selectedPassenger?: {
    id: string;
    name: string;
  };
};
export const MoreButtonContext = createContext<MoreButtonContext>({});
