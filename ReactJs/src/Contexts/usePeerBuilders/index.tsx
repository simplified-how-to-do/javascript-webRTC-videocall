import { useState, useMemo, useEffect, useCallback } from 'react';

import VideoStream from 'classes/VideoBuilder/utils/_VideoBuilderPeerConnection';
import apiSocket from 'services/apiSocket';

const usePeerBuilders = (props?: {
  room?: { id: string; password?: string };
  stream?: MediaStream | undefined;
}) => {
  const [localStream, setLocalStream] = useState(props?.stream);
  const [room, setRoom] = useState<{
    [key: string]: VideoStream;
  }>({});

  useEffect(() => {
    setLocalStream(props?.stream);
  }, [props?.stream]);

  // const callPeer = useCallback(
  //   (socketId) => {

  //   },
  //   [localStream, room]
  // );

  // useEffect(() => {
  //   apiSocket.on('room-updated-users', (data: any) => {
  //     //
  //   });
  //   apiSocket.on('room-received-call', async ({ offer, socketId }: any) => {
  //     if (socketId !== apiSocket.id) {
  //       if (confirm('deseja aceitar a ligação?')) {
  //         const answer = await videoStream.answerOffer(offer);

  //         answer &&
  //           apiSocket.emit('confirm-call', {
  //             answer,
  //             socketId,
  //           });
  //       }
  //     }
  //   });

  //   apiSocket.on('confirmed-call', async ({ answer, socketId }: any) => {
  //     if (socketId === apiSocket.id) {
  //       videoStream.confirmAnswer(answer);
  //     }
  //   });
  // }, []);

  return {
    localStream,
    room,
  };
};

export default usePeerBuilders;
