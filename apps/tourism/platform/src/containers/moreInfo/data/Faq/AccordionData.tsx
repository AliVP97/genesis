import FAQItem from 'containers/landingPage/components/faq/components/faqItem';
import { Faq } from 'containers/landingPage/types';
import React, { useState } from 'react';
import { Accordion } from 'react-accessible-accordion';
import { UUID } from 'react-accessible-accordion/dist/types/components/ItemContext';

export const AccordionData = () => {
  const [selectedFaq, setSelectedFaq] = useState<UUID[]>();
  const hotel_reserve_data = [
    {
      title: 'چگونه می توانم از هف‌هشتاد هتل رزرو کنم؟',
      description:
        'در قسمت بالای کادر جستجو بر روی تب هتل کلیک کنید و هتل مقصد خود را جستجو و تاریخ ورود و خروج خود را انتخاب کنید. پس از انتخاب هتل وارد حساب کاربری تان شوید و پرداخت هزینه را انجام دهید.',
    },
    {
      title: 'پرداخت هزینه رزرو هتل های خارجی با کارت های شتاب امکان پذیر است؟',
      description:
        'بله، هنگام رزرو هتل از هف‌هشتاد می توانید تمام هزینه ی هتل و خرید بلیط هواپیما خود را با کارت های شتاب ریالی پرداخت کنید.',
    },
    {
      title: 'پذیرش کودکان تا چه سنی رایگان خواهد بود؟',
      description:
        'پذیرش کودکان به صورت رایگان، به قوانین هر هتل بستگی دارد. لطفا پیش از رزرو هتل قسمت قوانین هتل را مطالعه کنید.',
    },
    {
      title: 'نیم شارژ ورود و خروج هتل چیست؟',
      description:
        'معمولا ساعت ورود به هتل 14 و ساعت خروج از هتل 12 ظهر است. اگر برنامه سفر شما به گونه است که زودتر و یا دیرتر از این زمان ها به هتل می رسید، می توانید هزینه نیم شارژ ورود و خروج را پرداخت کنید که معمولا معادل نصف هزینه یک شب اقامت در هتل خواهد بود. اما در برخی هتل ها این مبلغ متفاوت است. لطفا قبل از رزرو هتل قوانین هتل را مطالعه کنید.',
    },
    {
      title: 'زمان تحویل و پس دادن اتاق هتل چه ساعتی است؟',
      description:
        'معمولا ساعت ورود به اتاق هتل (چک این) ساعت 14 بعد ازظهر و ساعت خروج از هتل (چک اوت) 12 ظهر است.',
    },
    {
      title: 'واچر چیست؟',
      description:
        'واچر در واقع یک برگه است که اطلاعات کامل رزرو هتل شما در آن درج شده است و در واقع برگه تایید رزرو و پرداخت کامل هزینه هتل است. هنگام ارائه واچر باید دقت کنید که اطلاعات کاملا صحیح باشد.',
    },
  ];
  return (
    <div>
      <Accordion onChange={(e) => setSelectedFaq(e)} allowZeroExpanded>
        {hotel_reserve_data.map((item: Faq, index: number) => (
          <FAQItem
            key={index.toString() + item.description}
            title={item.title}
            description={item.description}
            id={index}
            selectedItem={selectedFaq}
          />
        ))}
      </Accordion>
    </div>
  );
};
