import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Form from '.';
import IFormProps from './types';

export default {
  title: 'Form',
  component: Form,
} as Meta;

export const Template: Story<IFormProps> = (args) => <Form {...args} />;
