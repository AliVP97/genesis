import React, { useContext, useMemo, useState } from 'react';
import useGetFields from '../../hooks/useGetFields';
import DynamicForm from './dynamicForm';

import { addPassenger, updatePassenger } from 'services/passenger';
import {
  AddPassengerFields,
  AddPassengerPayload,
  AddPassengerResponse,
} from 'services/passenger/interface';
import { useMutation, useQueryClient } from 'react-query';
import { definitions } from 'types/passenger';
import { MoreButtonContext } from 'components/passenger/context/MoreButtonContext';
import { notify } from 'utils/notification';
import { cloneDeep } from 'lodash';
import { passengerExtractor } from 'components/passenger/utils/passengerExtractor';
import { PassengerModel } from 'components/passenger/hooks/usePassenger';
import { UseFormReturn } from 'react-hook-form';

export type ErrorResponse = {
  response: {
    data: definitions['rpcStatus'];
  };
};

export type FormData = {
  mandatory: AddPassengerFields;
  optional: AddPassengerFields;
};
export const payloadMapper = (obj: Record<string, string>): { id: string; value: string }[] => {
  const items: { id: string; value: string }[] = [];
  for (const key in obj) {
    if (obj[key]) {
      items.push({ id: key, value: obj[key] });
    }
  }
  return items;
};
const dataHandler = (data?: AddPassengerFields) => {
  if (!data?.length) {
    return;
  }
  const obj: FormData = {
    mandatory: [],
    optional: [],
  };
  data.forEach((item) => {
    if (item.isOptional) {
      obj.optional.push(item);
    } else {
      obj.mandatory.push(item);
    }
  });
  return obj;
};
type AddPassenger = {
  passengerData?: definitions['passengerField'][];
  serviceName: string;
  passengerId?: string;
};
const AddPassenger = (props: AddPassenger) => {
  // if passenger data exist mean we are in edit form
  const queryClient = useQueryClient();
  const {
    setEditModal,
    setAddModal,
    setSelectedAfterAdd,
    addModal,
    editModal,
    selectedPassengers,
    setSelectedPassengers,
  } = useContext(MoreButtonContext);
  const { passengerData, serviceName, passengerId } = props;
  const { baseAddPassengerData, foreigner } = useGetFields({
    enable: passengerData ? false : true,
    serviceName,
  });
  const [formMethods, setFormMethods] = useState<
    UseFormReturn<
      {
        [x: string]: any;
      },
      object
    >
  >();
  const [addPassengerResponse, setAddPassengerResponse] = useState<AddPassengerResponse>();
  const [nationality, setNationality] = useState<string | undefined>('');

  const formData = useMemo(() => {
    if (passengerData) {
      return dataHandler(passengerData);
    }
    if (addPassengerResponse) {
      return dataHandler(addPassengerResponse?.fields);
    }
    if (nationality !== 'IRN') {
      return dataHandler(foreigner);
    }
    return dataHandler(baseAddPassengerData);
  }, [addPassengerResponse, baseAddPassengerData, nationality, passengerData]);

  const { mutate: addPassengerData, isLoading } = useMutation(
    (data: AddPassengerPayload) => addPassenger(data),
    {
      onSuccess: (res: AddPassengerResponse) => {
        setAddPassengerResponse(res);
        res.fields?.forEach((item) => {
          if (item.id === 'birthday' && formMethods) {
            if (item.value || item.valueHijri) {
              let val;
              if (item.calendarType === 'CALENDAR_TYPE_Hijri') {
                val = item.valueHijri?.replace(/\//g, '-');
              } else {
                val = item.value?.replace(/\//g, '-');
              }
              formMethods.setValue(item.id, val);
            }
          }
        });
        queryClient.invalidateQueries('passengerList');
        if (addModal && nationality !== 'IRN') {
          setSelectedAfterAdd && setSelectedAfterAdd(res.id);
        }
        if (nationality !== 'IRN') {
          setEditModal && setEditModal(false);
          setAddModal && setAddModal(false);
        }
        // Additional success logic
      },
      onError: (error) => {
        notify({
          type: 'error',
          message: (error as ErrorResponse)?.response?.data?.message,
        });
        // Error handling logic, e.g., display a message
      },
    },
  );
  const { mutate: updatePassengerData, isLoading: loading } = useMutation(
    (data: AddPassengerPayload) => {
      return updatePassenger(data, passengerId || (addPassengerResponse?.id as string));
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries('passengerList');
        if (addModal) {
          setSelectedAfterAdd && setSelectedAfterAdd(res.id);
        }
        if (editModal) {
          const newSelected = cloneDeep(selectedPassengers);
          newSelected?.forEach((item, idx) => {
            if (item.id === res.id) {
              const newPassenger = passengerExtractor(res.fields);
              if (newPassenger) {
                newPassenger.id = res.id;
                newPassenger.ageType = res.ageType;
              }
              newSelected[idx] = newPassenger as PassengerModel;
            }
          });
          setSelectedPassengers && newSelected && setSelectedPassengers(newSelected);
        }

        setEditModal && setEditModal(false);
        setAddModal && setAddModal(false);
        // Additional success logic
      },
      onError: (error) => {
        notify({
          type: 'error',
          message: (error as ErrorResponse)?.response?.data?.message,
        });
        // Error handling logic, e.g., display a message
      },
    },
  );

  const handleSubmit = (formData: Record<string, string>) => {
    if (passengerData || addPassengerResponse) {
      updatePassengerData({
        fields: payloadMapper(formData),
        serviceName: { serviceName: serviceName },
      });
    } else {
      addPassengerData({
        fields: payloadMapper(formData),
        serviceName: { serviceName },
      });
    }
  };

  return (
    <>
      {formData && (
        <DynamicForm
          setFormMethods={setFormMethods}
          setNationality={setNationality}
          fields={formData}
          onSubmit={handleSubmit}
          isLoading={isLoading || loading}
        />
      )}
    </>
  );
};

export default AddPassenger;
