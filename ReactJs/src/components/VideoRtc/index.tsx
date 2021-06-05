import React from 'react';
import IVideoRtcProps from './types';
import { Container } from './styles';

import VideoStream from 'classes/VideoBuilder/utils/_VideoBuilderPeerConnection';
import apiSocket from 'services/apiSocket';

const VideoRtc: React.FC<IVideoRtcProps> = ({ children, ...rest }) => {
  const [rooms, setRooms] = React.useState({});

  const videoStream = React.useMemo(() => {
    return new VideoStream({
      onLocalStream: (stream) => {
        const localVideo = document.getElementById('local-video') as
          | undefined
          | HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream;
        }
      },
      onRemoteStream: (stream) => {
        const localVideo = document.getElementById('remote-video') as
          | undefined
          | HTMLVideoElement;
        if (localVideo) {
          // console.log(stream);
          localVideo.srcObject = stream;
        }
      },
    });
  }, []);

  React.useEffect(() => {
    if (videoStream) {
      apiSocket.on('received-call', async ({ offer, socketId }: any) => {
        if (socketId !== apiSocket.id) {
          if (confirm('deseja aceitar a ligação?')) {
            const answer = await videoStream.answerOffer(offer);

            answer &&
              apiSocket.emit('confirm-call', {
                answer,
                socketId,
              });
          }
        }
      });

      apiSocket.on('confirmed-call', async ({ answer, socketId }: any) => {
        if (socketId === apiSocket.id) {
          videoStream.confirmAnswer(answer);
        }
      });
      return () => {
        apiSocket.off('received-call');
        apiSocket.off('confirmed-call');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStream]);

  async function call() {
    const offer = await videoStream.createOffer();

    if (offer) {
      apiSocket.emit('call-someone', {
        offer,
        socketId: apiSocket.id,
      });
    }
  }

  return <Container {...rest}>{children}</Container>;
};

export default VideoRtc;
