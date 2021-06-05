function getSupportedMediaRecordTypes() {
  const commonCodecs = {
    webm: ['codecs=vp9,opus', 'codecs=vp8,opus', 'codecs="vp8.0, vorbis"'],
    mp4: ['codecs="mp4a.40.5"', 'codecs="avc1.4D401E, mp4a.40.2"'],
    ogg: ['codecs="theora, vorbis"'],
  };

  // const video = document.createElement('video');
  // const canPlay = video.canPlayType;

  const supportedTypes: {
    [key: string]: {
      extension?: string;
      type?: string;
      mimeTypes?: string[];
      codecs?: string[];
    };
  } = {};
  let bestType = undefined as
    | undefined
    | {
        extension: string;
        type: string;
        codec: string;
        mimeType: string;
      };

  Object.entries(commonCodecs).map((entry) => {
    const [key, value] = entry;
    value?.forEach((codec: string) => {
      const thisType = `video/${key}`;
      const thisMimeType = `${thisType}; ${codec}`;

      if (MediaRecorder.isTypeSupported(thisMimeType)) {
        if (!supportedTypes[key]) {
          supportedTypes[key] = {
            extension: key,
            type: thisType,
            mimeTypes: [],
            codecs: [],
          };
        }
        supportedTypes[key].mimeTypes = [
          ...(supportedTypes[key].mimeTypes || []),
          thisMimeType,
        ];
        supportedTypes[key].codecs = [
          ...(supportedTypes[key].codecs || []),
          codec,
        ];

        if (!bestType) {
          bestType = {
            extension: key,
            type: thisType,
            codec: codec,
            mimeType: thisMimeType,
          };
        }
      }
    });
  });

  // video.remove();
  return { supportedTypes, bestType };
}

export default getSupportedMediaRecordTypes;
