/// <reference types="vite/client" />

declare module '*?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  /** PostHog project key (phc_…); unset means no analytics */
  readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
}
