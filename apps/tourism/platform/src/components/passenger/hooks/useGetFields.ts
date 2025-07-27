import { useQuery } from 'react-query';
import { getPassengerFields } from 'services/passenger';
import { definitions } from 'types/passenger';
type Field = definitions['passengerField'];
type GetFieldsOutput = {
  baseAddPassengerData: Field[];
  foreigner: Field[];
};
type UseGetFields = {
  serviceName: string;
  enable: boolean;
};
const useGetFields = ({ serviceName, enable }: UseGetFields): GetFieldsOutput => {
  const output: GetFieldsOutput = { baseAddPassengerData: [], foreigner: [] };

  const { data } = useQuery(
    ['passengerFields', serviceName],
    () => getPassengerFields(serviceName),
    { enabled: enable },
  );
  if (!enable) {
    return output;
  }
  if (data?.addPassengerData) {
    if (data.addPassengerData.length > 1) {
      output.baseAddPassengerData = data.addPassengerData[0].fields || [];
      output.foreigner = data.addPassengerData[1].fields || [];
    } else if (data.addPassengerData.length === 1) {
      output.foreigner = data.addPassengerData[0].fields || [];
      output.baseAddPassengerData = data.addPassengerData[0].fields || [];
    }
  }

  return output;
};

export default useGetFields;
