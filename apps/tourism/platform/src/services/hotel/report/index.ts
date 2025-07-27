import request from 'services/axios';
import { definitions } from 'types/hotel';

export type THotelApplyImageReportsBody = definitions['HotelApplyImageReportsBody'];
export type THotelImageReportTypeTitle = definitions['hotelImageReportTypeTitle'];
export type THotelImageReportTypeTitles = definitions['hotelImageReportTypeTitles'];
export type THotelImageReportType = definitions['hotelImageReportType'];

export const getReportImageTypes = async (requestId: string, hotelId: string) => {
  const { data }: { data: THotelImageReportTypeTitles } = await request.get(
    `hotel/v1/search/${requestId}/${hotelId}/report`,
  );
  return data;
};

export const handleReportImage = async (
  requestId: string,
  hotelId: string,
  body: THotelApplyImageReportsBody,
) => {
  const { data }: { data: THotelImageReportTypeTitles } = await request.post(
    `hotel/v1/search/${requestId}/${hotelId}/report`,
    {
      ...body,
    },
  );
  return data;
};
