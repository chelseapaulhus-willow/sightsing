import { registerPlugin } from '@capacitor/core';

export interface AudioOutput {
  type: string; // AVAudioSession.Port rawValue
  name: string;
}
export interface ApplyPreferredRouteResult {
  outputs: AudioOutput[];
}
export interface SpeakerRoutePlugin {
  applyPreferredRoute(): Promise<ApplyPreferredRouteResult>;
  isExternalConnected(): Promise<{ connected: boolean }>;
}

export const SpeakerRoute = registerPlugin('SpeakerRoute');
