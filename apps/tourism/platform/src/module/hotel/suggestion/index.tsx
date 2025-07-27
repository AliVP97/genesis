import { PropertyCarousel } from './components/PropertyCard';
import { TPropertyCardProps, TSuggestionItem } from './type';

export const HotelSuggestion = ({
  suggestions,
  isDesktop,
  requestId,
}: {
  suggestions: TSuggestionItem[];
  isDesktop: boolean;
  requestId: string;
}) => {
  const properties: TPropertyCardProps[] = [];

  suggestions?.forEach((item) => {
    item?.suggestions?.forEach((caseItem) => {
      if (caseItem?.hotel) {
        properties.push({
          tag: caseItem.tags?.[0] ?? 'Unknown Tag',
          priceAfterDiscount: String(caseItem.hotel.priceDetail?.priceAfterDiscount) || 'N/A',
          discountPercent: String(caseItem.hotel.priceDetail?.discountPercent) || 'N/A',
          image: String(
            caseItem.hotel.images?.[0] ?? 'https://public.780.ir/dl/hotel/Placeholder.png',
          ),
          title: caseItem.hotel.name || 'Unknown Hotel',
          rating: caseItem.hotel.star || 0,
          price: String(caseItem.hotel.priceDetail?.totalPrice) || 'N/A',
          discount: caseItem.hotel.priceDetail?.discountPercent || 'No Discount',
          star: String(caseItem.hotel.star) || '0',
          reviewCount: String(caseItem.hotel.reviews?.reviewCount) || '0',
          totalRate: String(caseItem.hotel.reviews?.totalRate) || '0',
          hotelId: String(caseItem?.hotel?.hotelId),
          requestId: requestId,
          uuid: caseItem.hotel?.uniqueId as string,
        });
      }
    });
  });

  return (
    <div style={{ position: 'sticky' }} className="w-full">
      <div className="my-3 flex w-full flex-col">
        {properties.length > 0 && (
          <PropertyCarousel
            isDesktop={isDesktop}
            caption=".  هرآنچه از یک اقامت عالی انتظار دارید، اینجاست "
            title="برترین هتل‌های هف‌هشتاد"
            properties={properties}
          />
        )}
      </div>
    </div>
  );
};
