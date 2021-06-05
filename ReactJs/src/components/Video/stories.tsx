import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Video from '.';
import IVideoProps from './types';

export default {
  title: 'Video',
  component: Video,
} as Meta;

export const Template: Story<IVideoProps> = (args) => <Video {...args} />;
