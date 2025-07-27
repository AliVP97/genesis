import { sanitizeText } from './../../../../../../utils/ecommerce/domain/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import {
  getReportImageTypes,
  handleReportImage,
  THotelApplyImageReportsBody,
  THotelImageReportType,
} from 'services/hotel/report';

export const useReport = () => {
  const { query } = useRouter();

  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [accessOpenReportModal, setAccessOpenReportModal] = useState<boolean>(false);

  const [imageSelected, setImageSelected] = useState<string>('');
  const [formData, setFormData] = useState<{
    reportType?: string;
    description?: string;
    hotelId: string;
    requestId: string;
    imageUrl?: string;
  }>({
    reportType: 'IMAGE_REPORT_TYPE_UNREAL',
    description: '',
    imageUrl: '',
    hotelId: query.hotelId ? String(query.hotelId) : '',
    requestId: '',
  });

  const { data: reportImageTypes } = useQuery({
    queryKey: ['reportImage', String(query.hotelId), String(query?.requestId)],
    queryFn: () => {
      return getReportImageTypes(String(query.hotelId), String(query?.requestId));
    },
    enabled: Boolean(query.hotelId && query.requestId),
  });

  const { mutate: mutateReportImage, isSuccess } = useMutation(
    (variables: { payload: THotelApplyImageReportsBody }) =>
      handleReportImage(String(query.requestId), String(query.hotelId), variables.payload),
    {
      onSuccess: () => {
        toast.success('گزارش با موفقیت ثبت شد');
        setOpenReportModal(false);
        setFormData((prev) => ({
          ...prev,
          reportType: '',
          description: '',
          imageUrl: '',
        }));
      },
      onError: (error: any) => {
        toast.error(sanitizeText(error?.response?.data?.message || 'خطا در ثبت گزارش'));
      },
    },
  );

  const handleSubmitReportImage = () => {
    mutateReportImage({
      payload: {
        imageUrl: formData.imageUrl || imageSelected,
        report: formData.description,
        type: formData.reportType as THotelImageReportType,
      },
    });
  };

  return {
    openReportModal,
    setOpenReportModal,
    reportImageTypes,
    formData,
    setFormData,
    handleSubmitReportImage,
    mutateReportImage,
    isSuccess,
    imageSelected,
    setImageSelected,
    accessOpenReportModal,
    setAccessOpenReportModal,
  };
};
