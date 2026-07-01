/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "staging" by the staging build so the app can flag itself. */
  readonly VITE_APP_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
