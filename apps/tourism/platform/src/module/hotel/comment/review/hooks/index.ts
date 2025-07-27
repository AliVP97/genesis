import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { hotelReviews } from 'services/hotel/detail/review';
import { ReviewProps } from '..';

export const useReviews = (reviews: Pick<ReviewProps, 'data'>) => {
  const { query } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessPreviewModal, setAccessPreviewModal] = useState(false);

  const { data: ReviewData } = useQuery(
    ['hotelReview', query?.hotelId as string, query.requestId as string],
    () => {
      return hotelReviews({
        hotelId: query?.hotelId as string,
        requestId: query.requestId as string,
      });
    },
  );
  useEffect(() => {
    reviews?.data?.reviews?.forEach((item) => {
      if (item?.comment?.length ?? 0 > 0) {
        setAccessPreviewModal(true);
      }
    });
  }, [reviews]);
  return {
    isModalOpen,
    setIsModalOpen,
    accessPreviewModal,
    setAccessPreviewModal,
    ReviewData,
  };
};
