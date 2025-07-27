import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { busViewListItemModel } from 'utils/ecommerce/application/mappers/bus/types';
import { propsModel } from 'utils/ecommerce/application/mappers/domestic-flight/types';
import { viewItemListModel } from 'utils/ecommerce/application/mappers/international-flight/types';
import { trainViewListItemModel } from 'utils/ecommerce/application/mappers/train/types';

type InitialStateType = {
  domesticFlightData: propsModel | unknown;
  internationalFlightData: viewItemListModel | unknown;
  internationalFlightCartObject: viewItemListModel | unknown;
  busData: busViewListItemModel | unknown;
  trainData: trainViewListItemModel | unknown;
  trainPassengersLength: number;
  hotelData: unknown;
  hotelPassengersLength: number;
};
const initialState: InitialStateType = {
  domesticFlightData: {},
  internationalFlightData: {},
  internationalFlightCartObject: {},
  busData: {},
  trainData: {},
  trainPassengersLength: 1,
  hotelPassengersLength: 1,
  hotelData: {},
};

export const ecommerceSlice = createSlice({
  name: 'ecommerceSlice',
  initialState,
  reducers: {
    domesticFlight: (
      state,
      action: PayloadAction<{
        flights: propsModel;
      }>,
    ) => {
      const { flights } = action.payload;
      state.domesticFlightData = { ...flights };
    },
    internationalFlight: (state, action: PayloadAction<{ data: viewItemListModel }>) => {
      const { data } = action.payload;
      state.internationalFlightData = { ...data };
    },
    internationalFlightCart: (state, action: PayloadAction<{ data: viewItemListModel }>) => {
      const { data } = action.payload;
      state.internationalFlightCartObject = { ...data };
    },
    busDataObject: (state, action: PayloadAction<{ data: busViewListItemModel }>) => {
      const { data } = action.payload;
      state.busData = data;
    },
    trainDataObject: (state, action: PayloadAction<{ data: trainViewListItemModel }>) => {
      const { data } = action.payload;
      state.trainData = { ...data };
    },
    setTrainPassengersLength: (state, action: PayloadAction<{ data: number }>) => {
      const { data } = action.payload;
      state.trainPassengersLength = data;
    },
    setHotelPassengersLength: (state, action: PayloadAction<{ data: number }>) => {
      const { data } = action.payload;
      state.hotelPassengersLength = data;
    },

    hotelDataObject: (state, action: PayloadAction<{ data: unknown }>) => {
      const { data } = action.payload;
      state.hotelData = data;
    },
  },
});

export const {
  domesticFlight,
  internationalFlight,
  internationalFlightCart,
  busDataObject,
  trainDataObject,
  setTrainPassengersLength,
  setHotelPassengersLength,
  hotelDataObject,
} = ecommerceSlice.actions;
export default ecommerceSlice.reducer;
