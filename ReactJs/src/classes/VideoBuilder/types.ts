import _VideoBuilderMediaRecorder from './utils/_VideoBuilderMediaRecorder';

export default interface IVideoBuilder {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
  onStreamStart?: (MediaStream: MediaStream | undefined) => void;
  onStreamError?: (MediaStream: unknown) => void;
  onRecordStateChange?: (recorder: _VideoBuilderMediaRecorder) => void;
  /** Filename without extension */
  filename?: string;
  preferredVideoType?: string;
}

export type VideoBuilderStateType = 'recording' | 'inactive' | 'paused';
