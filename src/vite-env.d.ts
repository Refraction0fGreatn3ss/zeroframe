/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_ZEROFRAME_API_URL?: string;
  readonly VITE_ZEROFRAME_REALTIME_URL?: string;
  readonly VITE_BUILD_ID?: string;
  readonly VITE_GIT_COMMIT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
