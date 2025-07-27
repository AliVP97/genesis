import Image from 'next/image';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
import cn from 'classnames';
import { ArrowLeftGreyIcon } from 'assets/icons';
import { TSuggestionItem } from 'services/tour/v2/searchLocation/types';
import router from 'next/router';

export const TabContent = ({ content }: { content: TSuggestionItem }) => {
  const { isMobile } = useDeviceDetect();
  const renderContent = () =>
    content?.map((item) => (
      <div
        onClick={() => router.push(`/tour/detail/${item?.id}`)}
        key={item?.id}
        className={cn(!isMobile && 'col-4')}
      >
        <div className="d-flex flex-row p-2  card mt-2 cursor-pointer">
          {item?.image && (
            <Image
              width={68}
              height={68}
              src={item?.image}
              alt={item?.title}
              className="rounded-2"
            />
          )}
          <div className="d-flex flex-row justify-content-between w-100">
            <div className="d-flex flex-column pe-3">
              <div className="text-3 text-weight-700 pb-2">{item?.title}</div>
              <div className="d-flex flex-row pt-2">
                <div className="text-3 text-weight-700 color-grey-24">{item?.month}</div>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center ps-1">
              <ArrowLeftGreyIcon style={{ scale: '1.3' }} />
            </div>
          </div>
        </div>
      </div>
    ));

  return <div className={cn(!isMobile && 'row')}>{renderContent()}</div>;
};
