import { dataTrain } from './data/dataTrain';

const CompanyDetails = ({ name }: { name: string }) => {
  return (
    <div className="my-5" dir="rtl">
      {dataTrain[name as keyof typeof dataTrain]?.body}
    </div>
  );
};
export default CompanyDetails;
