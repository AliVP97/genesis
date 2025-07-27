import { useGetImages } from 'module/general/config/hooks/useGetImages';
import Image from 'next/image';
import { customLoader } from 'utils/helpers/imageLoader';

interface TTravelTicketListEmptyWarningProps {
  title: string;
}
const TravelTicketListEmptyWarning = ({ title }: TTravelTicketListEmptyWarningProps) => {
  const { noTrips } = useGetImages();
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center mt-5">
        <Image
          loader={customLoader}
          src={noTrips}
          alt="empty travels"
          width="344"
          height="172"
          unoptimized
        />
        <p className="text-3 color-grey-1 mt-3">{title}</p>
      </div>
    </>
  );
};

export default TravelTicketListEmptyWarning;
