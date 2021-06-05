import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Select from '.';
import ISelectProps from './types';

export default {
  title: 'Select',
  component: Select,
} as Meta;

export const Template: Story<ISelectProps> = (args) => <Select {...args} />;
