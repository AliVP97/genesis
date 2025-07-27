import React from 'react';
import Score from './components/review';
import { definitions } from 'types/hotel';
import Comments from './components/comments';
import { ArrowLeftPrimaryColor } from 'assets/icons';
import ReviewModal from './components/ReviewModal';
import styles from './components/review.module.scss';
import classNames from 'classnames';
import { useReviews } from './hooks';
import Summurize from '../summurize';
import useDeviceDetect from 'utils/hooks/useDeviceDetect';
export type ReviewProps = {
  data: definitions['hotelReviewDetails'];
  hotelName?: string;
  summery?: string;
};
const Review = (props: ReviewProps) => {
  const { data, hotelName } = props;
  const { accessPreviewModal, isModalOpen, setIsModalOpen, ReviewData } = useReviews({
    data,
  });
  const { isMobile } = useDeviceDetect();
  return (
    <div>
      {data && ReviewData && (
        <ReviewModal
          setIsOpen={setIsModalOpen}
          isOpen={isModalOpen}
          data={data}
          name={hotelName}
          review={ReviewData}
        />
      )}
      <div className={styles['review-score']}>
        <Score data={data} />
        {isMobile && data?.reviewSummery && <Summurize text={data?.reviewSummery} />}

        {data.reviewCount && data.reviewCount > 0 && (
          <div className={classNames(styles['review-score-comments'])}>
            <Comments summery={data?.reviewSummery} data={data} />
          </div>
        )}
      </div>

      <div
        role="button"
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="d-flex gap-3 align-items-center mt-3 color-primary text-weight-500 text-4 "
      >
        {accessPreviewModal && (
          <>
            <ArrowLeftPrimaryColor />
            <span>
              مشاهده همه نظرات <span aria-hidden="true">({data.reviewCount} مورد)</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
