import React from 'react';
import dayjs from 'dayjs';
import { Star } from 'assets/icons';
import style from './review.module.scss';
type CommentProps = {
  data: {
    name?: string;
    createdAt?: string;
    rooms?: string[];
    checkIn?: string;
    nights?: string;
    totalRate?: number;
    comment?: string;
  };
};
const Comment = (props: CommentProps) => {
  const { data } = props;
  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-1 text-weight-700 text-3 color-orange-2 ">
            <span>
              <Star />
            </span>
            <span>{data.totalRate}</span>
          </div>
          <div>
            <div className="text-weight-400 text-4 color-black-4" dir="rtl">
              {data.name}
            </div>
            <div className="text-weight-300 text-2 color-black-4">
              {dayjs
                .unix(Number(data.createdAt))
                .locale('fa')
                .calendar('jalali')
                .format('dddd D MMMM YYYY')}
            </div>
          </div>
        </div>
        <div className="text-weight-400 text-3 color-surface-fixed my-2" dir="rtl">
          {data.comment}
        </div>
      </div>
      <div dir="rtl" className="d-flex align-items-center gap-2">
        {data.rooms?.map((item, idx) => {
          return (
            <div className={style['room__label']} key={idx}>
              <span className="text-weight-500 text-2 color-black-4">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comment;
