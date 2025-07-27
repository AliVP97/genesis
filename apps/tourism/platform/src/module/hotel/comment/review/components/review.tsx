import React from 'react';
import styles from './review.module.scss';
import { ReviewProps } from '..';
import { Rating } from 'react-simple-star-rating';
import classNames from 'classnames';
import Image from 'next/image';
const Score = (props: ReviewProps) => {
  const { data } = props;
  return (
    <div className={styles['score']}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-1 justify-content-between align-items-center text-4 text-weight-700 color-orange-2 ">
          <span>5</span> <span>از</span> <span>{data?.totalRate}</span>
        </div>
        <div className="text-4 text-weight-700 color-black-4">امتیاز و نظرات کاربران</div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <Rating
          initialValue={data?.totalRate}
          fillColor="#EC9A00"
          size={18}
          allowFraction
          readonly
        />
        <div className="d-flex justify-content-between align-items-center mt-1 text-2 text-weight-300 color-grey-23">
          (
          <div className="d-flex gap-1 justify-content-between align-items-center ">
            <span>نظر</span>
            <span>{data?.reviewCount}</span>
          </div>
          )
        </div>
      </div>
      <div className={classNames('mt-3', styles['rating'])}>
        {data?.rates?.map((item) => {
          return (
            <div key={item.type}>
              <div className="d-flex gap-1 justify-content-between align-items-center">
                <div className="d-flex gap-1 justify-content-between align-items-center text-weight-400 text-3 color-surface-fixed">
                  <span>5</span> <span>از</span>{' '}
                  <span className="text-weight-700 text-3">{item.rate}</span>
                </div>
                <div className="d-flex gap-1 justify-content-center align-items-center">
                  <span className="text-weight-500 text-3 color-surface-fixed">{item.name}</span>
                  <Image width={18} height={18} alt={item.name} src={item.icon || ''} />
                </div>
              </div>
              <progress
                dir="rtl"
                className={styles['progress']}
                value={item.rate}
                max="5"
              ></progress>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Score;
