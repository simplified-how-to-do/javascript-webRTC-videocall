import { VideoBuilderStateType } from 'classes/VideoBuilder/types';
import getSupportedMediaRecordTypes from './getSupportedMediaRecordTypes';

class _VideoBuilderMediaRecorder {
  #mediaRecorder: MediaRecorder;
  #stream: MediaStream;
  #filename: string;
  public get filename() {
    return this.#filename;
  }
  #videoType: string;
  public get videoType() {
    return this.#videoType;
  }
  #mimeType: string;
  public get mimeType() {
    return this.#mimeType;
  }
  #recordedBlobs: Blob[] = [];
  public get recordedBlobs() {
    return this.#recordedBlobs;
  }
  #completeRecordings: Blob[][] = [];
  public get completeRecordings() {
    return this.#completeRecordings;
  }
  #state: VideoBuilderStateType = 'inactive';
  public get state() {
    return this.#state;
  }
  #isLoading = false;
  public get isLoading() {
    return this.#isLoading;
  }
  onRecordStateChange?: (recorder: _VideoBuilderMediaRecorder) => void;

  constructor(
    stream: MediaStream,
    options?: {
      filename?: string;
      preferredVideoType?: string;
      onRecordStateChange?: (recorder: _VideoBuilderMediaRecorder) => void;
    }
  ) {
    const { filename, preferredVideoType, onRecordStateChange } = options || {};

    if (!stream) {
      throw new Error('Stream is needed to created the MediaRecorder');
    }
    this.#stream = stream;

    const { supportedTypes, bestType } = getSupportedMediaRecordTypes?.();
    const validVideoType =
      preferredVideoType &&
      supportedTypes?.[preferredVideoType]?.mimeTypes?.[0];
    if (validVideoType && preferredVideoType) {
      this.#mimeType = validVideoType;
      this.#videoType = preferredVideoType;
    } else if (bestType?.extension) {
      this.#mimeType = bestType.mimeType;
      this.#videoType = bestType.extension;
    } else {
      let allCodecs = '';
      Object.values(supportedTypes).forEach((exts) =>
        exts.mimeTypes?.forEach((mms) => mms && (allCodecs += `, ${mms}`))
      );

      throw new Error(`None of the codecs: ${allCodecs} are supported`);
    }

    this.onRecordStateChange = onRecordStateChange;
    this.setState('inactive');

    const noExtFilename =
      filename || `id:${this.#stream.id}-when:${Date.now()}`;
    this.#filename = `${noExtFilename}.${this.#videoType}`;

    this.#mediaRecorder = new MediaRecorder(this.#stream, {
      mimeType: this.#mimeType,
    });
  }

  setState(value: VideoBuilderStateType) {
    this.#state = value;
    if (typeof this.onRecordStateChange === 'function') {
      this.onRecordStateChange(this);
    }
  }

  startRecording() {
    if (this.#isLoading) return;
    // this.#mediaRecorder.onstop = () => {
    //   console.log('onstop');
    // };

    this.#mediaRecorder.ondataavailable = (event) => {
      if (!event.data || !event.data.size) return;

      this.#recordedBlobs.push(event.data);

      if (this.#mediaRecorder?.state === 'inactive') {
        this.#completeRecordings.push(this.#recordedBlobs);
        this.#recordedBlobs = [];
        this.#isLoading = false;
      }
    };

    this.#mediaRecorder.start();
    this.setState('recording');
    return this.#state;
  }

  stopRecording() {
    if (this.#state === 'inactive' || this.#isLoading) {
      return this.#state;
    }
    try {
      this.#isLoading = true;
      this.#mediaRecorder.stop();

      this.setState('inactive');
    } catch (err) {
      this.#isLoading = false;
    }
    return this.#state;
  }

  pauseRecording() {
    if (this.#state === 'recording') {
      this.#mediaRecorder.pause();
      this.setState('paused');
    }
    return this.#state;
  }

  resumeRecording() {
    if (this.#state === 'paused') {
      this.#mediaRecorder.resume();
      this.setState('recording');
    }
    return this.#state;
  }

  toggleRecording() {
    if (this.#state === 'recording') {
      return this.pauseRecording();
    } else if (this.#state === 'paused') {
      return this.resumeRecording();
    } else if (this.#state === 'inactive') {
      return this.startRecording();
    }
  }

  getAllVideoUrl() {
    if (this.#isLoading) return;
    return this.#completeRecordings.map((recording) => {
      const superBuffer = new Blob(recording, {
        type: this.#videoType,
      });

      return window.URL.createObjectURL(superBuffer);
    });
  }

  download(index?: number) {
    if (!this.#completeRecordings.length) return;

    function downloadBlob(this: _VideoBuilderMediaRecorder, record: Blob[]) {
      const blob = new Blob(record, { type: this.#videoType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = this.#filename;
      a.click();
      a.remove();
    }
    if (typeof index === 'number') {
      const record = this.#completeRecordings?.[index];
      if (record) {
        downloadBlob.apply(this, [record]);
      }
    } else {
      for (const record of this.#completeRecordings) {
        downloadBlob.apply(this, [record]);
      }
    }
  }
}

export default _VideoBuilderMediaRecorder;
