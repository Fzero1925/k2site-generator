/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ADSENSE_CLIENT_ID?: string;
  readonly PUBLIC_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// AdSense global types
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
    gtag?: (...args: any[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
    GA_TRACKING_ID?: string;
  }
}