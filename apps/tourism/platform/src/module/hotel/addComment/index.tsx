import Button from 'components/button';
import Checkbox from 'components/checkbox';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { addHotelComment, gethotelComment } from 'services/hotel/addComment/addComment';
import styles from './addComment.module.scss';
import cn from 'classnames';
import CommentReponse from './commentReponse';
import { useRouter } from 'next/router';
import { definitions } from 'types/hotel';
import { notify } from 'utils/notification';
import Spinner from 'components/spinner';

import CommentError from './commentGetError';

const rate = [
  { label: 'موقعیت و دسترسی هتل', value: 'REVIEW_LOCATION_AND_ACCESS_RATE' },
  { label: 'تناسب قیمت و خدمات', value: 'REVIEW_VALUE_FOR_MONEY_RATE' },
  { label: 'کیفیت غذا و رستوران', value: 'REVIEW_FOOD_AND_HOSPITALITY_QUALITY_RATE' },
  { label: 'وضعیت اتاق و بهداشت', value: 'REVIEW_CLEANLINESS_RATE' },
  { label: 'برخورد کارکنان هتل', value: 'REVIEW_STAFF_BEHAVIOR_RATE' },
  { label: 'از امکانات رفاهی هتل', value: 'REVIEW_ACCOMMODATION_FACILITIES_RATE' },
];
type RateType = definitions['hotelReviewRateTypes'];
const AddComment = () => {
  const route = useRouter();
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
  const {
    data: commentData,
    isLoading: getLoading,
    isError,
    error,
  } = useQuery(['addComment'], () => gethotelComment(route?.query?.orderId as string), {
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 409 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const [rates, setRates] = useState<{ rate: number; value: string }[]>([]);
  const [review, setReview] = useState('');
  const [guest, setGuest] = useState(false);
  const MAX_CHARACTERS = 180;

  const handleClick = (rateItem: { rate: number; value: string }) => {
    const idx = rates.findIndex((item) => {
      return item.value === rateItem.value;
    });
    const cpRates = [...rates];
    if (idx !== -1) {
      cpRates[idx].rate = rateItem.rate;
      setRates(cpRates);
    } else {
      cpRates.push(rateItem);
    }
    setRates(cpRates);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setReview(value);
    }
  };

  const {
    mutateAsync: postReview,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: () => {
      const newRates = rates.map((item) => {
        return {
          type: item.value,
          rate: item.rate,
        };
      });
      return addHotelComment(route?.query?.orderId as string, {
        reviewId: commentData?.reviewId,
        hotelId: commentData?.hotelId,
        name: commentData?.hotelName,
        comment: review,
        rate: newRates as RateType[],
        unknownUser: guest,
      });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        setIsAlreadySubmitted(true);
        notify({
          type: 'error',
          message: 'نظر شما قبلا ثبت شده است',
          config: { autoClose: false },
        });
      } else {
        notify({
          type: 'error',
          message: error?.response?.data?.message || 'خطایی رخ داده است. لطفا دوباره تلاش کنید',
        });
      }
    },
  });
  const isRateChosen = (i: number, item: string) => {
    const rateChosen = rates.find((itm) => {
      return itm.value === item && itm.rate === i;
    });
    if (rateChosen) {
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    if (rates.length !== rate.length) {
      notify({
        type: 'error',
        message: 'لطفا به تمام موارد امتیاز دهید',
      });
      return;
    }
    postReview();
  };
  if (getLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );
  } else if (isError) {
    return <CommentError message={error?.response?.data?.message} />;
  }
  return (
    <div dir="rtl">
      {isSuccess ? (
        <CommentReponse hotelName={commentData?.hotelName} />
      ) : (
        <div className={styles.card}>
          <div className={styles.container}>
            <div className={styles.header}>
              <div className="d-flex align-items-center" style={{ height: '16px' }}>
                <span className="text-3 text-weight-500">ثبت نظر جدید</span>
              </div>
              <hr />
            </div>
            <div>
              <div className="mt-4">
                <div className="text-4 text-weight-500">
                  نظر شما درباره هتل {commentData?.hotelName}
                </div>
                <div className="text-weight-400 mt-2">
                  لطفا به هر بخش از ۱ (کمترین) تا ۵ (بیشترین) امتیاز دهید.
                </div>
              </div>
              <div className="d-flex gap-2 my-2">
                {commentData?.rooms?.map((item) => {
                  return (
                    <div
                      key={item}
                      style={{ borderColor: '#CFD6DF', borderRadius: '8px' }}
                      className="border p-2"
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.container__rate}>
              {rate.map((item) => {
                return (
                  <div key={item.value}>
                    <div className="text-weight-700">میزان رضایت شما از {item.label}</div>
                    <div className="d-flex gap-2 my-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          role="button"
                          className={cn(
                            styles.rate,
                            isRateChosen(i + 1, item.value) && styles['rate-chosen'],
                          )}
                          onClick={() => handleClick({ value: item.value, rate: i + 1 })}
                          key={i}
                        >
                          <div> {i + 1}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-weight-700 mt-2">نظر خود را اینجا بنویسید</div>
            <textarea
              className={styles['text-area']}
              value={review}
              onChange={handleReviewChange}
            />
            <div
              className={cn(
                'text-weight-400',
                review.length === MAX_CHARACTERS ? 'color-error' : 'color-grey-23',
              )}
            >
              {review.length}/{MAX_CHARACTERS} کاراکتر
            </div>
            <div className="d-flex gap-1 align-items-center mt-2">
              <Checkbox
                handleClick={() => {
                  setGuest(!guest);
                }}
                checked={guest}
              />
              <div>نظر شما به صورت ناشناس و کاربر مهمان ثبت میشود</div>
            </div>
            <div className={styles.container__confirm}>
              <Button
                // className="w-100 bg-primary rounded mt-3"
                className="btn btn-primary d-block w-100 mt-3"
                loading={isLoading || getLoading}
                onClick={handleSubmit}
                disabled={isAlreadySubmitted}
              >
                ثبت نظر
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddComment;
