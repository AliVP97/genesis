import { useMemo } from 'react';
import { useWeb } from './useWeb';

type Props = {
  components: JSX.Element | JSX.Element[];
  value: string;
  webDisplayStart: number;
  webDisplayLimit: number;
};

const useSeperateCmsComponent = ({
  components,
  value,
  webDisplayStart,
  webDisplayLimit,
}: Props) => {
  const isWeb = useWeb();

  const normalizedComponents = useMemo(
    () => (Array.isArray(components) ? components : [components]),
    [components],
  );

  return useMemo(() => {
    const SelectedComponent = normalizedComponents.find((item) => item?.props?.component === value);

    const OtherComponents = normalizedComponents.filter((item) => item?.props?.component !== value);

    const displayedComponents = isWeb
      ? OtherComponents
      : OtherComponents.slice(webDisplayStart, webDisplayLimit);

    return { SelectedComponent, displayedComponents };
  }, [normalizedComponents, value, isWeb, webDisplayStart, webDisplayLimit]);
};

export default useSeperateCmsComponent;
