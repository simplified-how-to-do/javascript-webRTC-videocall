import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import TextArea from '.';
import ITextAreaProps from './types';

export default {
  title: 'TextArea',
  component: TextArea,
} as Meta;

export const Template: Story<ITextAreaProps> = (args) => <TextArea {...args} />;
