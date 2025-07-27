import { AddCommentError } from 'assets/icons';
import React from 'react';

type CommentGetErrorProps = {
  message: string;
};

const CommentError = (props: CommentGetErrorProps) => {
  const { message } = props;
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column text-center">
      <AddCommentError />
      <p dir="rtl" className="mt-3">
        {message}
      </p>
    </div>
  );
};

export default CommentError;
