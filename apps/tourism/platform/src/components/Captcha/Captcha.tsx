import { forwardRef } from 'react';

import { ArcaptchaProps, ArcaptchaRef, ArcaptchaWidget } from 'arcaptcha-react';

type TCaptchaProps = {
  /** This function would be called after solving captcha */
  onSuccess?: ArcaptchaProps['callback'];
  /** This function would be called after rendering checkbox */
  onRender?: ArcaptchaProps['rendered_callback'];
  /** This function would be called after closing captcha challenge */
  onClose?: ArcaptchaProps['closed_callback'];
  /** This function would be called after opening captcha challenge */
  onOpen?: ArcaptchaProps['opened_callback'];
  /** This function would be called after error */
  onError?: ArcaptchaProps['error_callback'];
  /** This function would be called after resetting captcha */
  onReset?: ArcaptchaProps['reset_callback'];
  /** This function would be called after expiring */
  onExpire?: ArcaptchaProps['expired_callback'];
  /** This function would be called after challenge expiration */
  onChallengeExpire?: ArcaptchaProps['chlexpired_callback'];
} & Pick<ArcaptchaProps, 'ref' | 'domain' | 'invisible' | 'lang' | 'theme' | 'color' | 'api_url'>;

export type CapthaRef = ArcaptchaRef;

export const Captcha = forwardRef<CapthaRef, TCaptchaProps>(
  (
    {
      onSuccess,
      onRender,
      onClose,
      onOpen,
      onError,
      onReset,
      onExpire,
      onChallengeExpire,
      ...props
    },
    ref,
  ) => {
    return (
      <ArcaptchaWidget
        ref={ref}
        site-key={process.env.NEXT_PUBLIC_ARCAPTCHA_SITE_KEY || ''}
        callback={onSuccess}
        rendered_callback={onRender}
        closed_callback={onClose}
        opened_callback={onOpen}
        error_callback={onError}
        reset_callback={onReset}
        expired_callback={onExpire}
        chlexpired_callback={onChallengeExpire}
        {...props}
      />
    );
  },
);

Captcha.displayName = 'Captcha';
