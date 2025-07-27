import { priceDetail } from 'services/train/tickets/priceDetail';
import { useMutation } from 'react-query';
import { PriceDetailData, PriceDetailPayload } from 'services/train/tickets/priceDetail/interface';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { TrainTicket } from '../interface';

export const usePriceDetail = (ticket: TrainTicket) => {
  const [detail, setDetail] = useState<PriceDetailData>();
  const { query } = useRouter();
  const initialChecked: boolean = query['wantCompartment'] === 'true';
  const [isChecked, setIsChecked] = useState(initialChecked);
  const { mutate: mutatePriceDetail, isLoading: priceLoading } = useMutation({
    mutationFn: (payload: PriceDetailPayload) => {
      return priceDetail(payload);
    },
    onSuccess: (data) => {
      setDetail(data);
    },
  });

  const priceDetailPayload = (hasCompartment = isChecked) => {
    if (!query?.adult) {
      const searchData = localStorage.getItem('train_search_query')
        ? JSON.parse(localStorage.getItem('train_search_query') || '')
        : '';
      const tickets = JSON.parse(
        sessionStorage.getItem('train_selected_ticket') || '',
      ) as TrainTicket[];
      const selected = tickets.find((item) => item.trainId === ticket.trainId);
      mutatePriceDetail({
        trainId: String(ticket?.trainId),
        passenger: {
          adult: Number(searchData?.adult),
          child: Number(searchData?.child),
          infant: Number(searchData?.infant),
        },
        wantCompartment: selected?.isCoupe || false,
      });
    } else {
      mutatePriceDetail({
        trainId: String(ticket?.trainId),
        passenger: {
          adult: Number(query?.adult),
          child: Number(query?.child),
          infant: Number(query?.infant),
        },
        wantCompartment: ticket.hasCompartment ? hasCompartment : false,
      });
    }
  };

  return {
    mutatePriceDetail,
    detail,
    priceLoading,
    priceDetailPayload,
    setIsChecked,
  };
};
