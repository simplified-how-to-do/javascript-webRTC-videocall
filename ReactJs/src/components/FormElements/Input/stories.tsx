import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Input from '.';
import IInputProps from './types';

export default {
  title: 'Input',
  component: Input,
} as Meta;

export const Template: Story<IInputProps> = (args) => <Input {...args} />;
