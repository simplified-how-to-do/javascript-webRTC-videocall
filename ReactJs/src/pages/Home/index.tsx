// import VideoBuilder from 'classes/VideoBuilder';
// import { VideoBuilderStateType } from 'classes/VideoBuilder/types';
import React from 'react';

import { Container } from './styles';
// import PeerBuilder from 'utils/PeerHandlers/PeerBuilder';
import MediaStreamBuilder from 'utils/MediaStreamBuilder';
import apiSocket from 'services/apiSocket';
import PeerRoomBuilder from 'utils/PeerHandlers/PeerRoomBuilder';
// import videoPeerTeste from './videoPeerTeste';
// videoPeerTeste();
const Home: React.FC = () => {
  const [streams, setStreams] = React.useState<{
    [key: string]: MediaStream;
  }>({});
  const [peers, setPeers] = React.useState<string[]>([]);
  const room = React.useMemo(() => {
    return new PeerRoomBuilder({
      offerOptions: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart: true,
      },
      onStateChange: (state, peer) => {
        console.log(state, peer.peerId);
      },
      onRemoteStream: (stream, peer) => {
        setStreams((prev) => ({ ...prev, [peer.peerId]: stream }));
      },
    });
  }, []);

  const stream = React.useMemo(() => {
    if (room) {
      const thisStream = new MediaStreamBuilder();

      thisStream.onStreamChange = (stream) => {
        if (stream) {
          room.setStream(stream);
        }
        const localVideo = document.getElementById('local-video') as
          | undefined
          | HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream || null;
        }
      };

      thisStream.getMediaDevice({ video: true });

      return thisStream;
    }
  }, [room]);

  React.useEffect(() => {
    if (room) {
      apiSocket.on(
        'webRTC-proposed-offer',
        async ({ offer, from, to }: any) => {
          if (to === apiSocket.id) {
            // const answered = window.confirm('deseja aceitar a ligação?');
            // if (answered) {
            const answer = await room.answerOffer({ offer, peerId: from });

            answer &&
              apiSocket.emit('webRTC-created-answer', {
                answer,
                from: apiSocket.id,
                to: from,
              });
            // }
          }
        }
      );

      apiSocket.on(
        'webRTC-proposed-answer',
        async ({
          answer,
          from,
          to,
        }: {
          answer: RTCSessionDescription;
          from: string;
          to: string;
        }) => {
          if (to === apiSocket.id) {
            room.confirmAnswer({ answer, peerId: from });
          }
        }
      );

      apiSocket.on('connected-peers', (peers: string[]) => {
        setPeers(peers);
      });
      return () => {
        apiSocket.off('webRTC-proposed-offer');
        apiSocket.off('webRTC-proposed-answer');
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  async function call(peerId: string) {
    const offer = await room.createOffer(peerId);
    if (offer) {
      apiSocket.emit('webRTC-created-offer', {
        offer,
        from: apiSocket.id,
        to: peerId,
      });
    }
  }

  return (
    <Container className="container">
      <header className="header">
        <div className="logo-container">
          <h1 className="logo-text">Caller</h1>
        </div>
      </header>
      <div className="content-container">
        <div className="active-users-panel" id="active-user-container">
          <h3 className="panel-title">Active Users:</h3>
          <div>
            <button
              onClick={() => {
                stream?.stopStream();
              }}
            >
              stop
            </button>
            <button
              onClick={async () => {
                await stream?.getMediaDevice({ video: true });
              }}
            >
              getMedia
            </button>
          </div>
          <div>
            <h3>stream</h3>
            <button
              onClick={() => {
                stream?.pauseStream();
              }}
            >
              pause
            </button>
            <button
              onClick={() => {
                stream?.resumeStream();
              }}
            >
              resume
            </button>
          </div>
          <div>
            <h3>audio</h3>
            <button
              onClick={() => {
                stream?.pauseAudio();
              }}
            >
              pause
            </button>
            <button
              onClick={() => {
                stream?.resumeAudio();
              }}
            >
              resume
            </button>
          </div>
          <div>
            <h3>video</h3>
            <button
              onClick={() => {
                stream?.pauseVideo();
              }}
            >
              pause
            </button>
            <button
              onClick={() => {
                stream?.resumeVideo();
              }}
            >
              resume
            </button>
          </div>
          <div>
            {peers?.map(
              (p) =>
                p !== apiSocket.id && (
                  <p key={p} onClick={() => call(p)}>
                    {p}
                  </p>
                )
            )}
          </div>
        </div>
        <div className="video-chat-container">
          <h2 className="talk-info" id="talking-with-info">
            Select active user on the left menu.
          </h2>
          <div className="video-container">
            <div
              style={{ display: 'flex', maxWidth: '100%' }}
              id="remoteVideos"
            >
              {Object.entries(streams).map(([k, v]: [string, MediaStream]) => (
                <video
                  autoPlay
                  // muted
                  style={{
                    width: '250px',
                    height: '200px',
                    border: '1px solid #212121',
                  }}
                  key={k}
                  ref={(e) => {
                    if (e) {
                      e.srcObject = v;
                    }
                  }}
                />
              ))}
            </div>
            {/* <video
              muted
              autoPlay
              className="remote-video"
              id="remote-video"
            ></video> */}
            <video
              autoPlay
              muted
              className="local-video"
              id="local-video"
            ></video>
          </div>
        </div>
      </div>
    </Container>
    // <Container className="row">
    //   <h1 className="col s12 m12 l12">Home</h1>
    //   <video
    //     className="col s12 m12 l12"
    //     controls
    //     height="300px"
    //     width="400px"
    //     ref={videoRef}
    //   />
    //   {/* {videoMedia?.mediaDevice?.currentStream && ( */}
    //   <button onClick={() => videoMedia?.mediaRecorder?.toggleRecording()}>
    //     {state === 'inactive'
    //       ? 'Start'
    //       : state === 'recording'
    //       ? 'Pause'
    //       : 'Resume'}
    //   </button>
    //   <button onClick={() => videoMedia?.mediaRecorder?.stopRecording()}>
    //     Stop
    //   </button>
    //   <button
    //     onClick={() => {
    //       videoMedia?.mediaRecorder?.download();
    //     }}
    //   >
    //     download
    //   </button>
    // </Container>
  );
};

export default Home;
