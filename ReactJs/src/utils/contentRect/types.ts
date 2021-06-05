export type IHandleContentRectReturn = {
  computedStyle: CSSStyleDeclaration;
  parent: HTMLElement | null;
  unityPixelSize: {
    percent: {
      children: {
        width: number;
        height: number;
      };
      own: {
        width: number;
        height: number;
      };
    };
    // em: _hcrSplitStyleUnit(computedStyle.fontSize).number,
    vh: number;
    vw: number;
    vmin: number;
    vmax: number;
  };
  clientWidth: number;
  clientHeight: number;
  innerWidth: number;
  innerHeight: number;
  target: Element;
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};
