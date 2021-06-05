type IOptions = {
  /** Retorna o valor em pixel. É preciso informar o valor em pixel de cada unidade. */
  toPx: {
    cm: number;
    mm: number;
    in: number;
    px: number;
    pt: number;
    pc: number;
    em: number;
    ex: number;
    ch: number;
    rem: number;
    vw: number;
    vh: number;
    vmin: number;
    vmax: number;
    percent: number;
  };
};

export default function _hcrSplitStyleUnit() {
  // data: string | number,
  // options: IOptions
  // const { toPx } = options || {};
  // const index = typeof data === 'string' && /[^0-9.]/g.exec(data)?.index;
  // if (typeof data === 'string' && typeof index === 'number') {
  //   const number = Number(data.substr(0, index));
  //   const thisUnity = data.substr(index);
  //   const defaultUnities = [
  //     'cm',
  //     'mm',
  //     'in',
  //     'px',
  //     'pt',
  //     'pc',
  //     'em',
  //     'ex',
  //     'ch',
  //     'rem',
  //     'vw',
  //     'vh',
  //     'vmin',
  //     'vmax',
  //     '%',
  //   ];
  //   const unity = defaultUnities.some((e) => e === thisUnity)
  //     ? thisUnity
  //     : undefined;
  //   const pxMultiplier = unity && toPx?.[unity === '%' ? 'percent' : unity];
  //   if (isNaN(number)) {
  //     return { number: undefined, unity };
  //   } else if (typeof pxMultiplier === 'number') {
  //     return { number: number * pxMultiplier, unity: 'px' };
  //   } else {
  //     return { number, unity };
  //   }
  // } else if (typeof data === 'number') {
  //   return { number: data, unity: undefined };
  // } else {
  //   return { number: undefined, unity: undefined };
  // }
}
