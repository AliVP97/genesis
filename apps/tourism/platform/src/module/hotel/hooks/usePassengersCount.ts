import { useRouter } from 'next/router';

const usePassengersCount = () => {
  const router = useRouter();
  const searchInfo = router?.query?.rooms || '';
  const passengers = (searchInfo as string)?.split('-')?.map((room: string) => ({
    adult: room?.split(',').length,
    child: room?.includes('CHILD') ? room?.split('+CHILD_')?.length : 0,
  }));
  return passengers;
};
export default usePassengersCount;
