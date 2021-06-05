import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Text from '.';
import ITextProps from './types';

export default {
  title: 'Text',
  component: Text,
} as Meta;

export const Template: Story<ITextProps> = (args) => <Text {...args} />;
