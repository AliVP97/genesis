import { useRouter } from 'next/router';

export const ServiceDetector = () => {
  const { pathname } = useRouter();
  const service = pathname === '/' ? 'flights' : pathname.replace('/', '');
  return service.replace('/[id]', '');
};

export const MainServiceDetector = () => {
  const { pathname } = useRouter();
  return pathname === '/' ? 'flights' : pathname.split('/')[1];
};

export const getServiceName = (pathName: string) =>
  pathName === '/' ? 'flights' : pathName.split('/')[1];
