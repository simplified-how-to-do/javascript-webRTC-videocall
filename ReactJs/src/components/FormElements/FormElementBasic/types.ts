/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface IFormElementBasicProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  style?: React.CSSProperties;
  className?: string;
  // children(node: any): React.FC<any>;
  children(node: any): any;
  validationMessage?: string | undefined;
  innerRef?(
    ref: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
  ): void;
  setter?(value: any): void;
  validation?(options: {
    castValue?: any;
    realValue?: any;
    ref?: HTMLElement;
  }): any;
  cast?: 'number' | 'string' | 'boolean' | 'parse' | 'tryparse';
}
