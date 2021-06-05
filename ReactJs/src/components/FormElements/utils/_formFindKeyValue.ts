/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-inner-declarations */
import _formSplitStringPath from './_formSplitStringPath';

export default function _formFindKeyValue(
  name: string,
  object: any,
  options: { parent: boolean }
) {
  const { parent } = options || {};
  if (name) {
    function isObj(dataCheck: any) {
      return Object.prototype.toString.call(dataCheck) === '[object Object]';
    }

    const path = _formSplitStringPath(name);

    function findValue(thisPath: typeof path, thisObject: any): any {
      const [key, ...rest] = thisPath || [];
      const { isArray, key: thisKey } = key || {};

      if (isArray && !Array.isArray(thisObject)) {
        return undefined;
      } else if (!isArray && !isObj(thisObject)) {
        return;
      } else if (rest.length > 0) {
        return findValue(rest, thisObject[thisKey]);
      } else {
        if (parent) {
          return thisObject;
        } else {
          return thisObject[thisKey];
        }
      }
    }

    return findValue(path, object);
  }
  return object;
}
