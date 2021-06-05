// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function _formCastType(value: any, type?: string) {
  if (type === 'number') {
    return Number(value);
  } else if (type === 'boolean') {
    if (value === 'false') {
      return false;
    } else {
      return Boolean(value);
    }
  } else if (type === 'string') {
    return String(value);
  } else if (type === 'parse') {
    return JSON.parse(value);
  } else if (type === 'tryparse') {
    try {
      return JSON.parse(value);
    } catch {
      return '';
    }
  } else {
    return value;
  }
}
