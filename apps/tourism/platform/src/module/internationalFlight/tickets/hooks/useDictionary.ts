import { TDictionary } from 'services/internationalFlight/flight/interface';
import { FlightV2 } from '../types/api';

interface Props {
  flight?: FlightV2;
  dictionary: TDictionary;
}

export const useDictionary = ({ flight, dictionary }: Props) => {
  const airlineCodes: string[] = [];
  const logoUrls: string[] = [];

  const airLineLogoMapper = () => {
    flight?.segments?.map((seg) => {
      // if (
      //   !airlineCodes.find(x => x.trim() == seg.operatingAirlineCode?.trim())
      // ) {
      airlineCodes.push(seg.operatingAirlineCode!);
      // }
    });

    airlineCodes.map((item) => {
      logoUrls.push(
        dictionary.airlineDictionary![item] && dictionary.airlineDictionary![item].logoUri!,
      );
    });
    return logoUrls;
  };
  return { airLineLogoMapper };
};
