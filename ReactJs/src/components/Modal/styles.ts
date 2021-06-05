import styled from 'styled-components';

interface IModalBackgroundStyleProps {
  top?: number;
  left?: number;
}

export const ModalBackground = styled.div.attrs(
  (props: IModalBackgroundStyleProps) => props
)`
  position: fixed;
  top: ${(props) => (props.top ? `-${props.top}px` : 0)};
  left: ${(props) => (props.left ? `-${props.left}px` : 0)};

  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;

  overflow: hidden;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
