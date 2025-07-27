import Modal from 'components/modal';
import React, { Dispatch, SetStateAction } from 'react';

import { definitions } from 'types/hotel';
import { CloseIcon } from 'assets/icons';
import Comment from './comment';
import style from './review.module.scss';
import { Review } from 'services/hotel/detail/review';
type ReviewModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: definitions['hotelReviewDetails'];
  name?: string;
  review: Review;
};
const ReviewModal = (props: ReviewModalProps) => {
  const { isOpen, setIsOpen, name, review } = props;
  return (
    <Modal
      className={style['container']}
      onClose={() => {
        setIsOpen(false);
      }}
      visible={isOpen}
    >
      <div className={style['modal']}>
        <div
          dir="rtl"
          onClick={() => {
            setIsOpen(false);
          }}
          className={style['modal__header']}
        >
          {' '}
          <CloseIcon />
          <span className="text-5 text-weight-500 color-black-2">{name}</span>
        </div>

        {/* <div className={style['score-container']}>
          <Score data={data} />
        </div> */}
        <div className={style['modal__title']}>
          <div
            onClick={() => {
              setIsOpen(false);
            }}
            role="button"
          >
            <CloseIcon />
          </div>

          <div dir="rtl" className="text-5 text-weight-500 color-black-4">
            نظرات {name}
          </div>
        </div>
        <div className="mt-4">
          <hr className="w-100"></hr>
          {review?.map((item, idx) => {
            return (
              <div key={idx}>
                <Comment data={item} />
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ReviewModal;
