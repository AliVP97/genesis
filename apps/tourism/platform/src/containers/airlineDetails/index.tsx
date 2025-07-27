import { dataFlight } from './data/dataFlight';

const AirlineDetails = ({ name }: { name: string }) => {
  return (
    <div className="my-5" dir="rtl">
      {dataFlight[name as keyof typeof dataFlight]?.body}
    </div>
  );
};
export default AirlineDetails;
