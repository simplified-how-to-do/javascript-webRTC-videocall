import { io } from 'socket.io-client';

export default function videoPeerTeste() {
  const peerConnection = new RTCPeerConnection();

  function unselectUsersFromList() {
    console.log('unselectUsersFromList');
    const alreadySelectedUser = document.querySelectorAll(
      '.active-user.active-user--selected'
    );

    alreadySelectedUser.forEach((el) => {
      el.setAttribute('class', 'active-user');
    });
  }

  function createUserItemContainer(socketId: any) {
    console.log('createUserItemContainer');
    const userContainerEl = document.createElement('div');

    const usernameEl = document.createElement('p');

    userContainerEl.setAttribute('class', 'active-user');
    userContainerEl.setAttribute('id', socketId);
    usernameEl.setAttribute('class', 'username');
    usernameEl.innerHTML = `Socket: ${socketId}`;

    userContainerEl.appendChild(usernameEl);

    userContainerEl.addEventListener('click', () => {
      unselectUsersFromList();
      userContainerEl.setAttribute(
        'class',
        'active-user active-user--selected'
      );
      const talkingWithInfo = document.getElementById('talking-with-info');
      if (talkingWithInfo) {
        talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
      }
      callUser(socketId);
    });

    return userContainerEl;
  }

  async function callUser(socketId: any) {
    console.log('callUser');
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('call-user', {
      offer,
      to: socketId,
    });
  }

  function updateUserList(socketIds: any) {
    console.log('updateUserList');
    const activeUserContainer = document.getElementById(
      'active-user-container'
    );

    socketIds.forEach((socketId: any) => {
      const alreadyExistingUser = document.getElementById(socketId);
      if (!alreadyExistingUser) {
        const userContainerEl = createUserItemContainer(socketId);

        if (activeUserContainer) {
          activeUserContainer.appendChild(userContainerEl);
        }
      }
    });
  }

  const socket = io('http://localhost:3333/');

  socket.on('update-user-list', (data: any) => {
    console.log('update-user-list', data);
    updateUserList(data?.users);
  });

  socket.on('remove-user', ({ socketId }: { socketId: any }) => {
    console.log('remove-user');
    const elToRemove = document.getElementById(socketId);

    if (elToRemove) {
      elToRemove.remove();
    }
  });

  socket.on('call-made', async (data: any) => {
    console.log('call-made');

    await peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('make-answer', {
      answer,
      to: data.socket,
    });
  });

  socket.on('answer-made', async (data: any) => {
    console.log('answer-made');
    await peerConnection.setRemoteDescription(data.answer);
    // await peerConnection.setRemoteDescription(
    //   new RTCSessionDescription(data.answer)
    // );

    callUser(data.socket);
  });

  peerConnection.ontrack = function ({ streams: [stream] }) {
    const remoteVideo = document.getElementById(
      'remote-video'
    ) as HTMLVideoElement | null;
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  };

  navigator.getUserMedia(
    { video: true, audio: true },
    (stream) => {
      const localVideo = document.getElementById(
        'local-video'
      ) as HTMLVideoElement | null;
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    },
    (error) => {
      console.warn(error.message);
    }
  );
}
