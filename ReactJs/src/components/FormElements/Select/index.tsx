import React from 'react';
import ITextAreaProps from './types';
import FormElementBasic from '../FormElementBasic';

const Select: React.FC<ITextAreaProps> = ({ children, ...rest }) => {
  return (
    <FormElementBasic {...rest}>
      {(thisProps) => <select {...thisProps}>{children}</select>}
    </FormElementBasic>
  );
};

export default Select;
