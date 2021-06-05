import React from 'react';
import ITextProps from './types';
import { Container } from './styles';
// import useLayoutContext from 'hooks/useLayoutContext';
import Modal from 'components/Modal';

const Text: React.FC<ITextProps> = ({ children, onDoubleClick, ...rest }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [newValue, setNewValue] = React.useState('');
  // const { adminActions } = useLayoutContext();
  // const { contentEditor } = adminActions || {};

  React.useEffect(() => {
    if (typeof children === 'function' || React.isValidElement(children)) {
      throw new Error(
        'Text component does not accept function or elements as children'
      );
    } else {
      const isValidString =
        typeof children === 'number' || typeof children === 'string';
      setValue(isValidString ? String(children) : '');
    }
  }, [children]);

  function handleDoubleClick(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) {
    // if (contentEditor) {
    setShowModal(true);
    // }
    return onDoubleClick?.(event);
  }

  return (
    <>
      {showModal && (
        <Modal
          style={{ background: '#fff' }}
          centralize
          onOutClick={() => setShowModal(false)}
        >
          <input
            onChange={(e) => {
              const thisValue = e.target.value;
              setNewValue(thisValue);
            }}
            defaultValue={value}
          />
          <button
            type="button"
            onClick={() => {
              setValue(newValue);
            }}
          >
            Atualizar
          </button>
        </Modal>
      )}
      <Container {...rest} onDoubleClick={handleDoubleClick}>
        {value}
      </Container>
    </>
  );
};

export default Text;
