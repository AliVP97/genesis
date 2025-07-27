import { cancellationRules } from 'services/hotel/orders/interface';
import Divider from 'components/divider';
import React from 'react';
import { getTextDirection } from 'utils/helpers/textDirection';
import { breakLines } from 'utils/helpers/breakLines';
interface Props {
  content: cancellationRules;
}
export const RefundPolicies = ({ content }: Props) => {
  return (
    <div className="p-4 rtl text-3 ">
      {content.map((item, index) => {
        const textContent = getTextDirection(item?.text as string);

        return (
          <div className="d-flex flex-column" key={index.toString() + item.penalty}>
            <span className="color-red-1">{item.penalty}</span>{' '}
            <span className="py-1 color-grey-2" dir={textContent}>
              {breakLines(item.text as string)}
            </span>{' '}
            {index != content.length - 1 && <Divider type="horizontal" style={'dashed'} />}
          </div>
        );
      })}
    </div>
  );
};
