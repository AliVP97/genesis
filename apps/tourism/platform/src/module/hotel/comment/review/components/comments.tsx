import React from 'react';
import { ReviewProps } from '..';
import styles from './review.module.scss';
import Comment from './comment';
import Summurize from '../../summurize';

const Comments = (props: ReviewProps) => {
  const { data, summery } = props;

  return (
    <div
      dir="rtl"
      style={{ overflowX: 'auto', overflowY: 'hidden' }}
      className="d-flex gap-4 w-100"
    >
      {summery && (
        <div className={styles.summurize}>
          <Summurize text={summery} />
        </div>
      )}
      {data?.reviews?.map((item, idx) => {
        if (!item.comment) return null;
        return (
          <div className={styles.card} key={idx}>
            <Comment data={item} />
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
