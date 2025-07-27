import cn from 'classnames';
import styles from '../../travels.module.scss';
import Skeleton from 'components/skeleton';

type TravelSkeletonProps = {
  numberOfSkeletons: number;
};

const TravelSkeleton = ({ numberOfSkeletons }: TravelSkeletonProps) => {
  return (
    <>
      {Array(numberOfSkeletons)
        .fill(0)
        .map((item, index) => {
          return (
            <div
              key={index.toString() + 'componentsSkeleton'}
              className={cn(styles['travels__ticket'], 'mb-3 p-3')}
            >
              <Skeleton
                type="myTravels"
                rtl={true}
                uniqueKey="myTravels"
                width="350"
                height="125"
              />
            </div>
          );
        })}
    </>
  );
};
export default TravelSkeleton;
