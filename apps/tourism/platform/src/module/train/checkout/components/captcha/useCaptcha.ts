import { useRouter } from 'next/router';
import { useCaptchaImage } from 'services/train/captcha';

export const useCaptcha = () => {
  const { query } = useRouter();

  return useCaptchaImage(query.id as string);
};
