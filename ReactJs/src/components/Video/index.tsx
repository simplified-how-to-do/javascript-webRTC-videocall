import React from 'react';
import IVideoProps from './types';
import { Container } from './styles';

const Video: React.FC<IVideoProps> = ({ children, ...rest }) => {
  return <Container {...rest}>{children}</Container>;
};

export default Video;
