type StaticMetaDataProps = {
  serviceName: string;
  origin: string;
  destination: string | undefined;
};

type StaticGenratorPros = {
  cityName: string;
  destination: string | undefined;
};

export type TripTypeAttributes = {
  title: string;
  description: string;
};

type ServiceStaticModel = {
  [key: string]: TripTypeAttributes;
};

const flightsStaticDataGenerator = ({ cityName, destination }: StaticGenratorPros) => {
  const data = {
    oneWay: {
      title: `رزرو و خرید بلیط هواپیما ${cityName}؛ قیمت پرواز ${cityName}؛ | هف‌هشتاد`,
      description: `خرید و رزرو بلیط هواپیما ${cityName}؛ قیمت لحظه‌ای و برنامه پروازهای سیستمی و چارتر ${cityName} را از معتبرترین ایرلاین‌ها، با پشتیبانی حرفه‌ای، در هف‌هشتاد مقایسه کنید.`,
    },
    roundTrip: {
      title: `قیمت، رزرو و خرید بلیط هواپیما پرواز ${cityName} | هف‌هشتاد`,
      description: `خرید و رزرو بلیط هواپیما ${cityName}؛ قیمت لحظه‌ای و برنامه پروازهای سیستمی و چارتر ${cityName} را از معتبرترین ایرلاین‌ها، با پشتیبانی حرفه‌ای در هف‌هشتاد ببینید.`,
    },
  };

  return destination ? data.roundTrip : data.oneWay;
};

const trainStaticDataGenerator = ({ cityName, destination }: StaticGenratorPros) => {
  const data = {
    oneWay: {
      title: `رزرو و خرید بلیط قطار ${cityName} با بهترین قیمت | هف‌هشتاد`,
      description: `رزرو آنلاین و خرید بلیط قطار ${cityName} (کوپه‌ای، دربست، اتوبوسی و سریع‌السیر) را در هف‌هشتاد با بهترین قیمت و پشتیبانی 24 ساعته از رجا، فدک، نورالرضا انجام دهید.`,
    },
    roundTrip: {
      title: `رزرو و خرید بلیط قطار  ${cityName} با بهترین قیمت | هف‌هشتاد`,
      description: `رزرو آنلاین و خرید بلیط قطار ${cityName} (کوپه‌ای، دربست، اتوبوسی و سریع‌السیر) را در هف‌هشتاد با بهترین قیمت و پشتیبانی 24 ساعته از رجا، فدک، نورالرضا انجام دهید.`,
    },
  };

  return destination ? data.roundTrip : data.oneWay;
};

const busStaticDataGenerator = ({ cityName, destination }: StaticGenratorPros) => {
  const data = {
    oneWay: {
      title: `رزرو و خرید بلیط اتوبوس ${cityName} با بهترین قیمت | هف‌هشتاد`,
      description: `رزرو آنلاین و خرید بلیط اتوبوس ${cityName} (VIP و معمولی) را در هف‌هشتاد با بهترین قیمت، بیشترین ظرفیت پشتیبانی 24 ساعته از بهترین شرکت های اتوبوسرانی انجام دهید.`,
    },
    roundTrip: {
      title: `رزرو و خرید بلیط اتوبوس ${cityName} با بهترین قیمت | هف‌هشتاد`,
      description: `رزرو آنلاین و خرید بلیط اتوبوس ${cityName} (VIP و معمولی) را در هف‌هشتاد با بهترین قیمت، بیشترین ظرفیت و پشتیبانی 24 ساعته از شرکت های اتوبوسرانی انجام دهید.`,
    },
  };

  return destination ? data.roundTrip : data.oneWay;
};

export const staticMetaData = ({ serviceName, origin, destination }: StaticMetaDataProps) => {
  const cityName = destination ? `${origin} ${destination}` : origin;

  const servicesData: ServiceStaticModel = {
    flights: flightsStaticDataGenerator({ cityName, destination }),
    international: flightsStaticDataGenerator({ cityName, destination }),
    train: trainStaticDataGenerator({ cityName, destination }),
    bus: busStaticDataGenerator({ cityName, destination }),
  };
  return servicesData[serviceName];
};
