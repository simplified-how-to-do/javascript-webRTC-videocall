// import { peerConnectionState } from 'classes/VideoBuilder/utils/_VideoBuilderPeerConnection';
import { peerConnectionState } from 'classes/VideoBuilder/utils/_VideoBuilderPeerConnection';
import PeerBuilder from '../PeerBuilder';

type TpeerId = string | number;
export type TPeerFromPeerRoomBuider = {
  peer: PeerBuilder;
  peerId: TpeerId;
  [key: string]: unknown;
};

class PeerRoomBuilder {
  #createPeer = (peerId: TpeerId) => {
    let peerConnection = this.peers.get(peerId)?.peer;
    if (!peerConnection) {
      peerConnection = new PeerBuilder({ stream: this.#stream });
      const thisPeer = { peer: peerConnection, peerId };
      this.#peers.set(peerId, thisPeer);
    }
    const peer = this.peers.get(peerId);

    if (!peerConnection || !peer) {
      throw new Error(
        'Enter an existing peerId or pass the required properties to create a peer.'
      );
    }

    peerConnection.onRemoteStream = (stream) => {
      this?.onRemoteStream?.(stream, peer);
    };
    peerConnection.onStateChange = (state) => {
      this?.onStateChange?.(state, peer);
    };
    return peer;
  };

  #offerOptions?: RTCOfferOptions;

  onRemoteStream?: (stream: MediaStream, peer: TPeerFromPeerRoomBuider) => void;
  onStateChange?: (
    state: peerConnectionState,
    peer: TPeerFromPeerRoomBuider
  ) => void;

  #stream?: MediaStream;
  public get stream() {
    return this.#stream;
  }

  #peers: Map<string | number, TPeerFromPeerRoomBuider> = new Map();
  public get peers() {
    return this.#peers;
  }

  constructor(options?: {
    onRemoteStream?: (
      stream: MediaStream,
      peer: TPeerFromPeerRoomBuider
    ) => void;
    onStateChange?: (
      state: peerConnectionState,
      peer: TPeerFromPeerRoomBuider
    ) => void;
    stream?: MediaStream;
    offerOptions?: RTCOfferOptions;
  }) {
    const { onRemoteStream, onStateChange, offerOptions, stream } =
      options || {};
    this.#offerOptions = offerOptions;
    this.onRemoteStream = onRemoteStream;
    this.onStateChange = onStateChange;
    if (stream) {
      this.setStream(stream);
    }
  }

  setStream(stream: MediaStream) {
    this.#stream = stream;

    this.#peers.forEach((peer) => {
      peer.peer.setStream(this.#stream);
    });
  }

  async createOffer(peerId: TpeerId) {
    const peerConnection = this.#createPeer(peerId);
    return peerConnection.peer.createOffer(this.#offerOptions);
  }

  async answerOffer(options: {
    offer: RTCSessionDescription;
    /** Used if the peer already exists in this room */
    peerId: TpeerId;
  }) {
    const { offer, peerId } = options;
    const peerConnection = this.#createPeer(peerId);
    return peerConnection.peer.answerOffer(offer, this.#offerOptions);
  }

  async confirmAnswer(options: {
    peerId: TpeerId;
    answer: RTCSessionDescription;
  }) {
    const { answer, peerId } = options;
    const peerConnection = this.peers.get(peerId);
    if (!peerConnection) {
      throw new Error('Peer not found for the given peerId.');
    }
    await peerConnection.peer.confirmAnswer(answer);
  }
}

export default PeerRoomBuilder;
