import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import VideoRtc from '.';
import IVideoRtcProps from './types';

export default {
  title: 'VideoRtc',
  component: VideoRtc,
} as Meta;

export const Template: Story<IVideoRtcProps> = (args) => <VideoRtc {...args} />;
