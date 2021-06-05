class MediaStreamBuilder {
  #stream: MediaStream | null = null;
  public get stream() {
    return this.#stream;
  }
  public set stream(stream: MediaStream | null) {
    this.#stream = stream;
    this.onStreamChange?.(this.#stream);
  }

  onStreamChange?: (stream: MediaStream | null) => void;

  constructor(args?: {
    stream?: MediaStream | null;
    onStreamChange?: (stream: MediaStream | null) => void;
  }) {
    this.#stream = args?.stream || null;
    this.onStreamChange = args?.onStreamChange;
  }

  async getMediaDevice(options?: MediaStreamConstraints) {
    const thisStream = await navigator.mediaDevices.getUserMedia(options);

    this.stream = thisStream;

    return thisStream;
  }

  pauseVideo() {
    const tracks = this.#stream?.getVideoTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  pauseAudio() {
    const tracks = this.#stream?.getAudioTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  pauseStream() {
    const tracks = this.#stream?.getTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  resumeVideo() {
    const tracks = this.#stream?.getVideoTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }

  resumeAudio() {
    const tracks = this.#stream?.getAudioTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }

  resumeStream() {
    const tracks = this.#stream?.getTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }

  stopStream() {
    const tracks = this.#stream?.getTracks() || [];
    for (const track of tracks) {
      track.stop();
    }
  }
}

export default MediaStreamBuilder;
