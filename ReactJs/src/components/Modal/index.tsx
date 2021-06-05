import React from 'react';

import { ModalBackground } from './styles';
import IModalProps from './types';

const Modal: React.FC<IModalProps> = ({
  children,
  onOutClick,
  centralize,
  ...rest
}) => {
  const [isObserved, setIsObserved] = React.useState(false);
  const [backgroundRef, setBackgroundRef] = React.useState(
    undefined as undefined | HTMLDivElement
  );
  const [backgroundConfig, setBackgroundConfig] = React.useState({
    top: 0,
    left: 0,
  });
  const modalContainerRef = React.useRef(null);

  type ThisMouseEvent = {
    path?: {
      includes(element: Element | undefined | null): boolean;
    };
  } & globalThis.MouseEvent;

  const handleClick = React.useCallback(
    (e: ThisMouseEvent) => {
      if (!e?.path?.includes?.(modalContainerRef?.current)) {
        onOutClick?.(e);
      }
    },
    [onOutClick]
  );

  React.useEffect(() => {
    const init = setTimeout(
      () => window.addEventListener('click', handleClick),
      50
    );

    return () => {
      window.removeEventListener('click', handleClick);
      clearTimeout(init);
    };
  }, [handleClick]);

  return (
    <>
      {centralize ? (
        <ModalBackground
          ref={(r) => {
            if (r && !isObserved) {
              setIsObserved(true);
              setBackgroundRef(r);
              new ResizeObserver(() =>
                handleCentralize(r, setBackgroundConfig)
              ).observe(r);
              // handleCentralize(r, setBackgroundConfig);
            }
          }}
          onAnimationEnd={() => {
            if (backgroundRef) {
              handleCentralize(backgroundRef, setBackgroundConfig);
            }
          }}
          top={backgroundConfig?.top}
          left={backgroundConfig?.left}
        >
          <div
            onAnimationEnd={() => {
              if (backgroundRef) {
                handleCentralize(backgroundRef, setBackgroundConfig);
              }
            }}
            {...rest}
            ref={modalContainerRef}
          >
            {children}
          </div>
        </ModalBackground>
      ) : (
        <div {...rest} ref={modalContainerRef}>
          {children}
        </div>
      )}
    </>
  );
};

type KeyTypes = 'left' | 'top';
interface ICentralizeConfig {
  left: number;
  top: number;
}

function handleCentralize(
  backgroundElement: HTMLDivElement,
  setCentralizeConfig: (
    prev: ICentralizeConfig | ((prev: ICentralizeConfig) => ICentralizeConfig)
  ) => void
) {
  if (backgroundElement?.getBoundingClientRect) {
    const rect = backgroundElement.getBoundingClientRect();

    setCentralizeConfig((prev) => {
      const newValues = {
        left: prev?.left,
        top: prev?.top,
      };

      ['left', 'top'].forEach((k) => {
        const key = k as KeyTypes;
        if (rect?.[key] !== prev?.[key]) {
          if (rect?.[key] < prev?.[key]) {
            const thisValue = prev?.[key] + rect?.[key];
            if (thisValue !== prev?.[key]) {
              newValues[key] = thisValue | 0;
            }
          } else {
            newValues[key] = rect?.[key] | 0;
          }
        }
      });

      if (
        Object.keys(newValues).every((k) => {
          const key = k as KeyTypes;

          return newValues?.[key] === prev?.[key];
        })
      ) {
        return { ...prev };
      }
      return newValues;
    });
  }
}

export default Modal;
