/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-inner-declarations */
import _formSplitStringPath from './_formSplitStringPath';

function _formCreateNamePath(name: string, object: any, value: any) {
  if (name) {
    function isObj(dataCheck: any) {
      return Object.prototype.toString.call(dataCheck) === '[object Object]';
    }

    const path = _formSplitStringPath(name);

    function createPath(thisPath: typeof path, thisObject: any) {
      const [key, ...rest] = thisPath || [];
      const { isArray, key: thisKey } = key || {};

      if (isArray && !Array.isArray(thisObject)) {
        thisObject = [];
      } else if (!isArray && !isObj(thisObject)) {
        thisObject = {};
      }

      function handleValue(v: any) {
        const thisKeyIndex =
          (isArray && typeof thisKey === 'number') ||
          (typeof thisKey === 'string' && Number(thisKey));
        if (isArray && (!thisKey || thisKey === '' || thisKeyIndex < 0)) {
          thisObject.push(v);
        } else {
          thisObject[thisKey] = v;
        }
      }

      if (rest.length > 0) {
        handleValue(createPath(rest, thisObject[thisKey]));
      } else {
        handleValue(value);
      }

      return thisObject;
    }

    return createPath(path, object);
  }

  return object;
}

export default _formCreateNamePath;
