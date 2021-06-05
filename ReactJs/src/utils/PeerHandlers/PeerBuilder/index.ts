/* eslint-disable @typescript-eslint/no-explicit-any */
export type peerConnectionState =
  | 'closed'
  | 'connected'
  | 'connecting'
  | 'disconnected'
  | 'failed'
  | 'new';

class PeerBuilder {
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

  #remoteStream?: MediaStream;
  public get remoteStream() {
    return this.#remoteStream;
  }

  onRemoteStream?: (stream: MediaStream) => void;
  onStateChange?: (state: peerConnectionState) => void;

  #state?: peerConnectionState = 'new';
  public get state() {
    return this.#state;
  }

  constructor(options?: {
    onRemoteStream?: (stream: MediaStream) => void;
    onStateChange?: (state: peerConnectionState) => void;
    stream?: MediaStream;
  }) {
    const { onRemoteStream, onStateChange, stream } = options || {};
    if (stream) {
      this.setStream(stream);
    }

    this.onRemoteStream = onRemoteStream;
    this.onStateChange = onStateChange;

    const getData = (event: RTCPeerConnection) => {
      const { connectionState: cs, iceConnectionState: ics } = event;
      const previousValue = this.#state;
      if (cs === 'connected' && (ics === 'connected' || ics === 'completed')) {
        this.#state = 'connected';
      } else if (cs === 'failed' || ics === 'failed') {
        this.#state = 'failed';
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

  setStream(stream?: MediaStream) {
    this.#peerConnection.getSenders().forEach((sender) => {
      this.#peerConnection.removeTrack(sender);
    });
    if (stream) {
      stream.getTracks().forEach((track) => {
        this.#peerConnection.addTrack(track, stream);
      });
    }
  }

  /**
   * It is the first step to creant an WebRTC connection.
   * If stream is not setted, it will call the mediaDevice api
   */
  async createOffer(options?: RTCOfferOptions) {
    const offer = await this.#peerConnection.createOffer(options);
    await this.#peerConnection.setLocalDescription(offer);

    await this.#setIceCandidates();

    return this.#peerConnection.localDescription;
  }

  /**
   * Need to receive and offer from another peer.
   * Can be used to answer another answer, it will be used as an offer.
   * If stream is not setted, it will call the mediaDevice api
   */
  async answerOffer(offer: RTCSessionDescription, options?: RTCOfferOptions) {
    await this.#peerConnection.setRemoteDescription(offer);
    const answer = await this.#peerConnection.createAnswer(options);
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
}

export default PeerBuilder;
