/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
// import { ConversionIcon } from 'assets/icons';
import { jwtParsToken } from 'utils/helpers/tokens';
import { WebPagePreview } from 'components/webPagePreview';
// import Button from 'components/button';
import HeaderHoc from 'components/headerHoc';
import cn from 'classnames';
import styles from 'utils/cms/components/support/style.module.scss';
import { useIsSuperApp } from '../../../utils/hooks/useIsSuperApp';
import { SUPPORT_TEXT } from './constants';
import { cmsFactory } from 'utils/cms/factory';
import { SupportPageProps } from 'pages/support';

const Support = ({ content }: SupportPageProps) => {
  const isSuperApp = useIsSuperApp();
  const [handleChat, setHandleChat] = useState({
    preview: false,
    url: '',
  });
  const redirectConversationPage = (): void => {
    const token = localStorage.getItem('UATP') as string;
    const phone = token ? (jwtParsToken(token)?.payload?.mobile as string) : undefined;
    const normalizedPhone = phone ? phone.replace('98', '0') : '';

    const chatUrl = phone
      ? `${process.env.NEXT_PUBLIC_SUPPORT_DOMAIN}?phone=${normalizedPhone}`
      : (process.env.NEXT_PUBLIC_SUPPORT_DOMAIN as string);

    setHandleChat({
      preview: true,
      url: chatUrl,
    });
  };
  const supportComponents = content && cmsFactory({ cmsData: content });
  return (
    <>
      <HeaderHoc>
        <span>{SUPPORT_TEXT.SUPPORT}</span>
      </HeaderHoc>
      {!handleChat.preview ? (
        <div>
          <div
            className={cn(
              styles.support__content,
              isSuperApp && 'mt-4 text-weight-bold text-3',
              'text-center rtl',
            )}
          >
            {supportComponents}
            {/* <Button
              onClick={() => redirectConversationPage()}
              className={cn(styles.support__button)}
            >
              <ConversionIcon className="ms-2" />
              گفت‌و‌گو با پشتیبانی
            </Button> */}
          </div>
        </div>
      ) : (
        <>
          <WebPagePreview visible={handleChat.preview} url={handleChat.url} />
        </>
      )}
    </>
  );
};

export default Support;
