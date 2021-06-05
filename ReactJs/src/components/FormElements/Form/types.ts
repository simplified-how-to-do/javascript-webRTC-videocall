export default interface IFormProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >,
    'onSubmit'
  > {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  innerRef?(ref: HTMLFormElement | null): void;
  notNull?: boolean;
  isFormData?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?(data: any, event: React.FormEvent): void;
}
