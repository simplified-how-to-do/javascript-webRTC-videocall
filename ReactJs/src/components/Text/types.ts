interface TextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  children?: string | number;
  className?: string;
  as?: React.ElementType | keyof JSX.IntrinsicElements;
  /** Maximum number os lines */
  lines?: number;
  /** is lines is being used, change lineHeight here */
  lineHeight?: number;
  /** if true, the height will be equal as the lines * lineHeight */
  fixedHeight?: boolean;
}

export default TextProps;
