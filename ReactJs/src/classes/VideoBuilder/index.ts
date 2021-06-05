import IVideoBuilder from './types';
import _VideoBuilderMediaRecorder from './utils/_VideoBuilderMediaRecorder';

class _VideoBuilderMediaDevice {
  onStreamStart?: (MediaStream: MediaStream | undefined) => void;
  onStreamError?: (error: unknown) => void;
  #currentStream?: MediaStream;
  public get currentStream() {
    return this.#currentStream;
  }
  #mediaRecorder?: _VideoBuilderMediaRecorder;
  public get mediaRecorder() {
    return this.#mediaRecorder;
  }

  constructor(props: IVideoBuilder) {
    // this.userRecordings = new Map();

    this.onStreamStart = props?.onStreamStart;
    this.onStreamError = props?.onStreamError;

    this.getCamera(props);
  }

  async getCamera(options?: IVideoBuilder) {
    const { audio, video, filename, preferredVideoType, onRecordStateChange } =
      options || {};
    if (audio || video) {
      await navigator.mediaDevices
        .getUserMedia({
          video,
          audio,
        })
        .then((thisStream) => {
          if (thisStream) {
            this.#currentStream = thisStream;
            this.#mediaRecorder = new _VideoBuilderMediaRecorder(
              this.#currentStream,
              {
                filename,
                preferredVideoType,
                onRecordStateChange,
              }
            );
            if (typeof this.onStreamStart === 'function') {
              this.onStreamStart(this.#currentStream);
            }
          }
        })
        .catch((err) => {
          this.#currentStream = undefined;
          if (typeof this.onStreamError === 'function') {
            this.onStreamError(err);
          }
        });
    }
  }

  stopCurrentStream() {
    this.#currentStream?.getTracks?.()?.forEach?.((track) => {
      track.stop();
    });
    this.#mediaRecorder?.stopRecording();
  }
}

export default _VideoBuilderMediaDevice;
