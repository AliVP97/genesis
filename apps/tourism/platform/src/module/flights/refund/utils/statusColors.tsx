import React from 'react';
import { TicketStatusFa } from '../index';

type TStatusColor = (status: keyof typeof TicketStatusFa) => React.ReactNode;

export const StatusColor: TStatusColor = (status) => {
  switch (status) {
    case 'TICKETSTATUS_REFUND_FAILED':
    case 'TICKETSTATUS_REFUND_REJECTED':
      return <span className="text-danger">{TicketStatusFa[status]}</span>;
    case 'TICKETSTATUS_REFUND_DONE':
    case 'TICKETSTATUS_REFUND_CONFIRMED':
      return <span className="text-success">{TicketStatusFa[status]}</span>;
    case 'TICKETSTATUS_UNDEFINED':
    case 'TICKETSTATUS_ISSUED':
    case 'TICKETSTATUS_REFUND_REQUESTED':
    case 'TICKETSTATUS_REFUND_PROCESSING':
    default:
      return <span>{TicketStatusFa[status]}</span>;
  }
};
