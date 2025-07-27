import Head from 'next/head';

type TSeo = {
  title: string;
  description: string;
  keyword: string;
  imageUrl: string;
};
type TSearchPaheHeader = {
  bus: TSeo;
  train: TSeo;
};

export const SearchPageHeader = ({
  url,
  service,
}: {
  url: string;
  service: string;
}): JSX.Element => {
  const content: TSearchPaheHeader = {
    bus: {
      title: 'رزرو و خرید بلیط اتوبوس با بهترین قیمت | هف‌هشتاد',
      description:
        'رزرو آنلاین و خرید بلیط اتوبوس (VIP و معمولی) را در هف‌هشتاد با بهترین قیمت، بیشترین ظرفیت و پشتیبانی 24 ساعته از شرکت های اتوبوسرانی انجام دهید.',
      keyword: 'خرید بلیط اتوبوس',
      imageUrl: 'https://cdn.780.team/cms/bus_35858fba62.webp',
    },
    train: {
      title: 'رزرو و خرید بلیط قطار با بهترین قیمت | هف‌هشتاد',
      description:
        'رزرو آنلاین و خرید بلیط قطار (کوپه‌ای، دربست، اتوبوسی و سریع‌السیر) را در هف‌هشتاد با بهترین قیمت و پشتیبانی 24 ساعته از رجا، فدک، نورالرضا انجام دهید.',
      keyword: 'خرید بلیط قطار',
      imageUrl: 'https://cdn.780.team/cms/train_9f2357b4ea.webp',
    },
  };
  return (
    <Head>
      <title>{content[service as keyof typeof content].title}</title>
      <meta property="og:title" content={content[service as keyof typeof content].title} />
      <meta name="keywords" content={content[service as keyof typeof content].keyword} />
      <meta name="description" content={content[service as keyof typeof content].description} />
      <meta property="og:image:alt" content={content[service as keyof typeof content].keyword} />
      <meta
        name="og:image"
        property="og:image"
        content={content[service as keyof typeof content].imageUrl}
      />
      <link rel="canonical" href={`https://780.ir/tourism/${url}`} />
    </Head>
  );
};
