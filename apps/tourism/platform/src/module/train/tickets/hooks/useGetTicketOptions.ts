import { useFreeOptionalServices, useOptionalServices } from 'module/train/hooks';

export const useGetTicketOptions = (trainId: string | undefined, enabled = true) => {
  const { data: optionalServices, isLoading: optionalServicesIsLoading } = useOptionalServices(
    trainId,
    { enabled },
  );

  const { data: freeOptionalServices, isLoading: freeOptionalServicesIsLoading } =
    useFreeOptionalServices(trainId, { enabled });

  return {
    optionalServices,
    freeOptionalServices,
    isLoading: optionalServicesIsLoading || freeOptionalServicesIsLoading,
  };
};
