export default interface IModalProps {
  style?: React.CSSProperties;
  centralize?: boolean;
  onOutClick?(event: globalThis.MouseEvent): void;
}
