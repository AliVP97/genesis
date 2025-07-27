declare module 'arcaptcha-react' {
  // Export the types, functions, and components you need
  export const ArcaptchaWidget: React.FC<ArcaptchaProps>;

  export interface ArcaptchaRef {
    /**
     * Programmatically trigger a challenge request.
     * This can be used to load an invisible captcha after triggering a button.
     */
    execute: () => Promise<{
      arcaptcha_token: string;
      site_key: string;
    }>;

    /**
     * Reset the current challenge.
     */
    resetCaptcha: () => void;
  }

  // Define any types or interfaces as needed
  export interface ArcaptchaProps {
    ref?: React.ForwardedRef<ArcaptchaRef> | React.RefObject<ArcaptchaRef>;
    /** This is your sitekey, this allows you to load captcha. If you need a sitekey, please visit Arcaptcha, and sign up to get your sitekey */
    'site-key': string; // required
    /** Whenever there is no access to window (Mobile environments) you can set domain manually */
    domain?: string; // default: window.location.hostname
    /** This allows you to use invisible captcha for your forms */
    invisible?: boolean; // default: false
    /** This allows you to choose language by this prop. you can choose 'en' or 'fa' for English and Persian language */
    lang?: 'en' | 'fa'; // default: 'fa'
    /** This allows you to choose theme for your widget. The themes are light and dark */
    theme?: 'light' | 'dark'; // default: 'light'
    /** Color of every colored element in widget and challenge. */
    color?: string; // default: 'normal'
    /** This allows you to change default widget api. */
    api_url?: string; // default: 'https://widget.arcaptcha.ir/1/api.js'
    /** This function would be called after solving captcha */
    callback?: (token: string) => void;
    /** This function would be called after rendering checkbox */
    rendered_callback?: () => void;
    /** This function would be called after closing captcha challenge */
    closed_callback?: () => void;
    /** This function would be called after opening captcha challenge */
    opened_callback?: () => void;
    /** This function would be called after error */
    error_callback?: (error: { code: number; message: string }) => void;
    /** This function would be called after resetting captcha */
    reset_callback?: () => void;
    /** This function would be called after expiring */
    expired_callback?: () => void;
    /** This function would be called after challenge expiration */
    chlexpired_callback?: () => void;
  }
}
