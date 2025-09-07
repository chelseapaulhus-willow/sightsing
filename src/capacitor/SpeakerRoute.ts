import { registerPlugin } from '@capacitor/core';

export interface AudioOutput { type: string; name: string }
export interface ApplyPreferredRouteResult { outputs: AudioOutput[] }

export interface SpeakerRoutePlugin {
  applyPreferredRoute(): Promise<ApplyPreferredRouteResult>;
  isExternalConnected(): Promise<{ connected: boolean }>;
}

// Optional web fallback so dev-in-browser doesn’t crash
export const SpeakerRoute = registerPlugin<SpeakerRoutePlugin>('SpeakerRoute', {
  web: () => ({
    async applyPreferredRoute() { return { outputs: [] }; },
    async isExternalConnected() { return { connected: false }; }
  }) as any
});
