import './docs';
import { IHandleContentRectReturn } from './types';
// import _hcrSplitStyleUnit from './_hcrSplitStyleUnit';

function contentRect(
  node: HTMLElement,
  callBack: (
    rect: IHandleContentRectReturn
  ) => IHandleContentRectReturn | undefined
) {
  if (node instanceof HTMLElement) {
    new ResizeObserver((entry) => {
      const { contentRect, target } = entry?.[0];
      const { clientWidth, clientHeight } = document.documentElement;
      const { innerWidth, innerHeight } = window;
      const { top, right, bottom, left, width, height, x, y } =
        contentRect || {};
      const computedStyle = window.getComputedStyle(node);

      const parent = target?.parentElement;
      const { clientWidth: pw, clientHeight: ph } = parent || {};

      const smaller = clientWidth > clientHeight ? clientHeight : clientHeight;
      const bigger = clientWidth > clientHeight ? clientHeight : clientHeight;

      console.log(computedStyle.fontSize);
      const rect = {
        computedStyle,
        parent,
        unityPixelSize: {
          percent: {
            children: {
              width: width / 100,
              height: height / 100,
            },
            own: {
              width: typeof pw === 'number' ? pw / 100 : width,
              height: typeof ph === 'number' ? ph / 100 : width,
            },
          },
          // em: _hcrSplitStyleUnit(computedStyle.fontSize).number,
          vh: clientWidth / 100,
          vw: clientHeight / 100,
          vmin: smaller / 100,
          vmax: bigger / 100,
        },
        target,
        clientWidth,
        clientHeight,
        innerWidth,
        innerHeight,
        bottom,
        height,
        left,
        right,
        top,
        width,
        x,
        y,
      };

      if (typeof callBack === 'function') {
        callBack(rect);
      }
      return rect;
    }).observe(node);
  }
}

export default contentRect;
