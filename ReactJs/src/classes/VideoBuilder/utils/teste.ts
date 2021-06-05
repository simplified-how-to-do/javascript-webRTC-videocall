class _VideoBuilderPeerConnection {
  #peerConnection = new RTCPeerConnection();

  localStream: MediaStream;
  remoteStream?: MediaStream;
  peerId: string;
  status: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' =
    'new';

  constructor(options: {
    peerId: string;
    localStream: MediaStream;
    onFailed?: (peerId: string) => void;
    onConnecting?: (peerId: string) => void;
    onConnected?: (peerId: string) => void;
    onDisconnected?: (peerId: string) => void;
    onRemoteStream?: (stream: MediaStream) => void;
  }) {
    this.peerId = options.peerId;
    this.localStream = options.localStream;
    const { onRemoteStream } = options || {};

    this.#peerConnection.onconnectionstatechange = (event: any) => {
      this.status = event.target.connectionState;

      if (this.status === 'failed') {
        options?.onFailed?.(this.peerId);
      } else if (this.status === 'connecting') {
        options?.onConnecting?.(this.peerId);
      } else if (this.status === 'connected') {
        options?.onConnected?.(this.peerId);
      } else if (this.status === 'disconnected') {
        options?.onDisconnected?.(this.peerId);
      }
    };
    this.#peerConnection.ontrack = (event: RTCTrackEvent) => {
      const stream = event?.streams?.[0];

      if (stream) {
        this.remoteStream = stream;
        if (typeof onRemoteStream === 'function') {
          onRemoteStream(stream);
        }
      }
    };
  }

  async createOffer() {
    this.localStream
      .getTracks()
      .forEach((track) =>
        this.#peerConnection.addTrack(track, this.localStream)
      );
    const offer = await this.#peerConnection.createOffer();
    await this.#peerConnection.setLocalDescription(offer);

    return offer;
  }

  async createAnswer(offer: RTCSessionDescriptionInit) {
    await this.#peerConnection.setRemoteDescription(offer);
    this.localStream
      .getTracks()
      .forEach((track) =>
        this.#peerConnection.addTrack(track, this.localStream)
      );
    const answer = await this.#peerConnection.createAnswer();
    await this.#peerConnection.setLocalDescription(answer);

    return answer;
  }

  async confirmAnswer(answer: RTCSessionDescriptionInit) {
    await this.#peerConnection.setRemoteDescription(answer);
  }
}

export default _VideoBuilderPeerConnection;
