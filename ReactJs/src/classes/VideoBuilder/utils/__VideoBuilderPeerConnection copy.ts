class __VideoBuilderPeerConnection {
  // Instância da conexão WebRTC deste peer, ela é a base para toda operação.
  // Ela quem é responsável por criar ofertas, respostas, e se conectar a outros peers.
  #peerConnection = new RTCPeerConnection();
  peer = this.#peerConnection;

  // Aqui guardaremos a stream que será recebida por outros peers,
  // não será responsabilidade dessa classe dizer o que será feito com esse stream.
  // A classe será apenas para obtê-lo, cabendo a quem for utilizar, decidir o que fazer
  remoteStream?: MediaStream;

  // Idêntico ao remoteStream, porém, é a stream desse próprio peer.
  localStream?: MediaStream;

  constructor(options?: {
    onLocalStream?: (stream: MediaStream) => void;
    onRemoteStream?: (stream: MediaStream) => void;
  }) {
    // Aqui são apenas duas funções criadas por mim que servirão como um evento.
    // Assim que for obtido a stream remota e/ou local, eles serão chamados.
    // Utilizado para auxiliar na utilização dessas streams, já que a obtênção depende
    // do próprio usuário confirmar aceitar o pedido de mídia.
    const { onLocalStream, onRemoteStream } = options || {};

    // Esse é um evento de nossa conexão WebRTC, que, assim que uma conexão for
    // estabelecida, e o nosso peerConnection receber a stream de outro peer,
    // esse evento será chamado para salvar a stream, funciona tal qual o evento
    // que criamos anteriormente, porém, como não deixamos o peerConnection acessível
    // fora da classe, criamos o onRemoteStream para isso.
    this.#peerConnection.ontrack = ({ streams }: RTCTrackEvent) => {
      const stream = streams?.[0];

      if (stream) {
        this.remoteStream = stream;
        if (typeof onRemoteStream === 'function') {
          onRemoteStream(stream);
        }
      }
    };

    // Aqui é onde fazemos o pedido para o usuário local, ou seja, esse próprio peer,
    // pedindo para acessar a sua câmera e áudio, para que possamos gerar a stream,
    // Seja para disponibilizar localmente, ou para fornecer para outros peers.
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;

        if (typeof onLocalStream === 'function') {
          onLocalStream(stream);
        }

        // Esse processo é um dos pontos chaves para fornecer a mídia, aqui estamos
        // pegando cada track gerada pela stream, nesse caso, a track de áudio de vídeo
        // e também passamos a stream como um todo, o motivo de passar dessa forma é
        // para que possa ser escolhida a track da stream que deseja passar, por exemplo,
        // poderíamos passar só a track de áudio ou só a de vídeo, mas localmente,
        // manter o áudio ligado. Aqui adicionamos ao peerConnection nossas tracks, ou seja,
        // não é ela quem ativará nosso onTrack, e sim a track adicionada pelo peer remoto,
        // quando nossa conexão for estabelecida.
        stream
          .getTracks()
          .forEach((track) => this.#peerConnection.addTrack(track, stream));
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  // Aqui criamos a oferta da conexão, onde criamos o objeto offer, e depois assinamos ele
  // com nossas descrições locais. Como pode ver, não cabe a essa classe dizer como a oferta
  // será utilizada, ela apenas retornará o pedido. Para ofertar para outro usuário,
  // é necessário um servidor, que levará essa oferta até o usuário desejado, por exemplo,
  // digamos que eu tenha uma api, eu informo a ela a minha oferta, e ela enviará essa oferta
  // para outro usuário, nesse caso, é mais comum utilizarmos um websocket.
  async call() {
    const offer = await this.#peerConnection.createOffer();
    await this.#peerConnection.setLocalDescription(offer);

    return offer;
  }

  // Aqui é onde o outro peer usará a oferta que recebeu, adicionando uma descrição remota
  // a esta oferta, essa descrição funciona como um "Aceito" na oferta que foi enviada.
  // Depois ele cria a sua resposta para esta oferta, e cria a sua resposta, que é semelhante
  // ao método call, porém no lugar de uma offer é uma answer. Com a resposta em mãos,
  // o usuário envia para o servidor, para que ele retorne a resposta para o usuário que
  // realizou a oferta.
  async answerCall(offer: RTCSessionDescriptionInit) {
    await this.#peerConnection.setRemoteDescription(offer);
    const answer = await this.#peerConnection.createAnswer();
    await this.#peerConnection.setLocalDescription(answer);

    return answer;
  }

  // Aqui é onde o usuário que realizou a oferta, recebe a resposta. Com a resposta em mãos,
  // ele também adicionará uma descrição remota na resposta, assim como o usuário remoto,
  // fez com a oferta. Pronto, com isso, já temos uma das conexões, agora, é necessário que
  // o outro usuário, repita esse processo, ou seja, precisamos que ambos os usuários,
  // sejam tanto o emissor como o receptor para que seja possível que a conexão seja feita.
  // Quando ambos os contratos forem realizados, ai sim, o remoteStream será preenchido,
  // e consequentemente o evento onRemoteStream que criamos será chamado. Com as stream
  // em mãos, agora basta preencher o srcObjet de uma tag vídeo.
  async confirmCall(answer: RTCSessionDescriptionInit) {
    await this.#peerConnection.setRemoteDescription(answer);
  }
}

export default __VideoBuilderPeerConnection;
