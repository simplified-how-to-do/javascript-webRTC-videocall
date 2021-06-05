import React from 'react';
import IInputProps from './types';
import FormElementBasic from '../FormElementBasic';

const Input: React.FC<IInputProps> = (props) => {
  return (
    <FormElementBasic {...props}>
      {(thisProps) => (
        <>
          <input {...thisProps} />
        </>
      )}
    </FormElementBasic>
  );
};

export default Input;
