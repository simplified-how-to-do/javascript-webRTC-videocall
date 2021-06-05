import React from 'react';
import ITextAreaProps from './types';
import FormElementBasic from '../FormElementBasic';

const TextArea: React.FC<ITextAreaProps> = (props) => {
  return (
    <FormElementBasic {...props}>
      {(thisProps) => <TextArea {...thisProps} />}
    </FormElementBasic>
  );
};

export default TextArea;
