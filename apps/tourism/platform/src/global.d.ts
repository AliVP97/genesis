type GtagCommand = 'config' | 'set' | 'event';

interface GtagEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  non_interaction?: boolean;
}

interface GtagConfigParams {
  page_path?: string;
  send_page_view?: boolean;
}

interface Window {
  dataLayer: (typeof window)['dataLayer'];
  gtag: (
    command: GtagCommand,
    targetIdOrConfig: string | GtagConfigParams,
    configOrEventParams?: GtagConfigParams | GtagEventParams,
  ) => void;
}
