/* eslint-disable @typescript-eslint/no-explicit-any */
export type peerConnectionState =
  | 'closed'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'failed'
  | 'new';

class _VideoBuilderPeerConnection {
  #peerConnection = new RTCPeerConnection();
  #setIceCandidates = async () => {
    await new Promise((resolve) => {
      const timeoutPromise = setTimeout(() => {
        resolvePromise();
      }, 2000);
      const resolvePromise = () => {
        clearTimeout(timeoutPromise);
        this.#peerConnection.onicecandidate = null;
        resolve(true);
      };
      if (this.#peerConnection.iceGatheringState === 'new') {
        this.#peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            clearTimeout(timeoutPromise);
          }
          if (event.candidate === null) {
            resolvePromise();
          }
        };
      } else {
        resolvePromise();
      }
    });
  };

  /**
   * When remote peer is disconnected, the remoteStream will probably be stopped or undefined.
   * When the connection with the peer fails, the remoteStream will be setted to undefined.
   */
  #remoteStream?: MediaStream;
  public get remoteStream() {
    return this.#remoteStream;
  }

  #localStream?: MediaStream;
  public get localStream() {
    return this.#localStream;
  }

  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onStateChange?: (state: peerConnectionState) => void;

  #state?: peerConnectionState = 'new';
  public get state() {
    return this.#state;
  }

  constructor(options?: {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
    onStateChange?: (state: peerConnectionState) => void;
    localStream?: MediaStream;
  }) {
    const { onLocalStream, onRemoteStream, onStateChange, localStream } =
      options || {};
    if (!this.#localStream && localStream) {
      this.getMediaDevice({ localStream });
    }

    this.onLocalStream = onLocalStream;
    this.onRemoteStream = onRemoteStream;
    this.onStateChange = onStateChange;

    const getData = (event: RTCPeerConnection) => {
      const { connectionState: cs, iceConnectionState: ics } = event;
      const previousValue = this.#state;
      if (cs === 'connected' && (ics === 'connected' || ics === 'completed')) {
        this.#state = 'connected';
      } else if (cs === 'failed' || ics === 'failed') {
        this.#state = 'failed';
        this.#remoteStream = undefined;
      } else if (cs === 'closed' || ics === 'closed') {
        this.#state = 'closed';
      } else if (cs === 'disconnected' || ics === 'disconnected') {
        this.#state = 'disconnected';
      } else if (cs === 'connecting' || ics === 'checking') {
        this.#state = 'connecting';
      } else {
        this.#state = 'new';
      }

      if (previousValue !== this.#state) {
        console.log(this.#state);
        this?.onStateChange?.(this.#state);
      }
    };

    this.#peerConnection.onconnectionstatechange = (event: any) =>
      getData(event.target);
    this.#peerConnection.oniceconnectionstatechange = (event: any) =>
      getData(event.target);

    this.#peerConnection.ontrack = (event: RTCTrackEvent) => {
      const stream = event?.streams?.[0];

      if (stream) {
        this.#remoteStream = stream;
        this?.onRemoteStream?.(stream);
      }
    };
  }

  /** If localStream is not setted, or not passed argument, it will call the mediaDevice api */
  async getMediaDevice(
    options?: MediaStreamConstraints & { localStream?: MediaStream }
  ) {
    const { audio = true, video = true, peerIdentity, localStream } =
      options || {};
    const onStreamSet = (newStream: MediaStream) => {
      this.#localStream = newStream;

      this.onLocalStream?.(newStream);

      newStream
        .getTracks()
        .forEach((track) => this.#peerConnection.addTrack(track, newStream));
    };

    if (!this.#localStream) {
      if (localStream) {
        onStreamSet(localStream);
      } else {
        await navigator.mediaDevices
          .getUserMedia({ audio, video, peerIdentity })
          .then((thisStream) => onStreamSet(thisStream))
          .catch((error) => {
            console.warn(error.message);
          });
      }
    }

    return this.#localStream;
  }

  /**
   * It is the first step to creant an WebRTC connection.
   * If localStream is not setted, it will call the mediaDevice api
   */
  async createOffer(options?: RTCOfferOptions) {
    const { offerToReceiveAudio = true, offerToReceiveVideo = true } =
      options || {};

    await this.getMediaDevice();
    const offer = await this.#peerConnection.createOffer({
      offerToReceiveAudio,
      offerToReceiveVideo,
    });
    await this.#peerConnection.setLocalDescription(offer);

    await this.#setIceCandidates();

    return this.#peerConnection.localDescription;
  }

  /**
   * Need to receive and offer from another peer.
   * Can be used to answer another answer, it will be used as an offer.
   * If localStream is not setted, it will call the mediaDevice api
   */
  async answerOffer(offer: RTCSessionDescription, options?: RTCOfferOptions) {
    const { offerToReceiveAudio = true, offerToReceiveVideo = true } =
      options || {};
    await this.getMediaDevice();

    await this.#peerConnection.setRemoteDescription(offer);
    const answer = await this.#peerConnection.createAnswer({
      offerToReceiveAudio,
      offerToReceiveVideo,
    });
    await this.#peerConnection.setLocalDescription(answer);
    await this.#setIceCandidates();

    return this.#peerConnection.localDescription;
  }

  /**
   * Finish the offer / answer procces.
   * It will not create a new offer.
   */
  async confirmAnswer(answer: RTCSessionDescription) {
    await this.#peerConnection.setRemoteDescription(answer);
  }

  pauseVideo() {
    const tracks = this.localStream?.getVideoTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  pauseAudio() {
    const tracks = this.localStream?.getAudioTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  pauseStream() {
    const tracks = this.localStream?.getTracks() || [];
    for (const track of tracks) {
      track.enabled = false;
    }
  }

  resumeVideo() {
    const tracks = this.localStream?.getVideoTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }

  resumeAudio() {
    const tracks = this.localStream?.getAudioTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }

  resumeStream() {
    const tracks = this.localStream?.getTracks() || [];
    for (const track of tracks) {
      track.enabled = true;
    }
  }
}

export default _VideoBuilderPeerConnection;
