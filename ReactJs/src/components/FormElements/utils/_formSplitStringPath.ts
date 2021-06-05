export default function _formSplitStringPath(str: string | undefined) {
  if (typeof str === 'string') {
    const path = String(str).replaceAll('[', '.[').split('.');

    if (path?.[0] === '') {
      path.shift();
    }

    return path?.map((thisKey) => {
      const isArray =
        thisKey?.[0] === '[' && thisKey?.[thisKey.length - 1] === ']';
      const key = isArray
        ? thisKey?.replace?.('[', '')?.replace?.(']', '')
        : thisKey;

      return { isArray, key };
    });
  } else {
    return undefined;
  }
}
