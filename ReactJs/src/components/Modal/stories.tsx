import React from 'react';
import { Meta, Story } from 'types/StoryBookCustomTypes';
import Modal from '.';
import IModalProps from './types';

export default {
  title: 'Modal',
  component: Modal,
} as Meta;

export const Template: Story<IModalProps> = (args) => <Modal {...args} />;
