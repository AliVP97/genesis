import { DownArrow, UpArrow } from 'assets/icons';
import React, { useState, ReactNode } from 'react';

export type TShowMore = {
  title?: string;
  className: string;
  expandedData: ReactNode;
  closedData: ReactNode;
};
export const ShowMore = ({ className, expandedData, closedData, title }: TShowMore) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  return (
    <>
      {showMore ? (
        <>
          <div>{expandedData}</div>
          <div className={className} onClick={() => setShowMore(false)}>
            <UpArrow className="m-1 mt-2" />
            بستن متن
          </div>
        </>
      ) : (
        <>
          <h1>{title}</h1>
          <div>{closedData}</div>
          <div className={className} onClick={() => setShowMore(true)}>
            <DownArrow className="m-1 mt-2" />
            مشاهده تمام متن
          </div>
        </>
      )}
    </>
  );
};
