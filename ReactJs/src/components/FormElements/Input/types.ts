import IFormElementBasicProps from '../FormElementBasic/types';

type IInputProps = Omit<IFormElementBasicProps, 'children'>;

export default IInputProps;
