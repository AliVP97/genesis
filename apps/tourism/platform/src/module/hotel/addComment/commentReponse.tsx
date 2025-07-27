import { Tick } from 'assets/icons';
import React from 'react';
type CommentReponseProps = {
  hotelName?: string;
};
const CommentReponse = (props: CommentReponseProps) => {
  const { hotelName } = props;
  return (
    <div className="d-flex justify-content-center align-items-center flex-column vh-100 w-100">
      <Tick />
      <div className="text-3 text-weight-500 mt-4">نظر شما ثبت شد.</div>
      <div className="color-grey-23 font-weight-400">
        نظر و امتیاز شما برای هتل {hotelName} با موفقیت ثبت شد. از زمانی که اختصاص دادید سپاسگزاریم
      </div>
    </div>
  );
};

export default CommentReponse;
