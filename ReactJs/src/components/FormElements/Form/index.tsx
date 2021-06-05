/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import IFormProps from './types';
import _formCastType from '../utils/_formCastType';
import _formCreateNamePath from '../utils/_formCreateNamePath';

interface IFormStore {
  setValidations(name: string, validation: (values: any) => Promise<any>): void;
  getKeyValue(
    name: string | undefined
  ): {
    realValue: string | File | null | undefined;
    castValue: string | File | null | undefined;
  };
}
export const formStore = React.createContext<IFormStore | undefined>(undefined);

const Form: React.FC<IFormProps> = ({
  children,
  innerRef,
  notNull,
  isFormData,
  onSubmit,
  ...rest
}) => {
  const [validations, setValidations] = React.useState({});
  const [ref, setRef] = React.useState(
    undefined as undefined | HTMLFormElement
  );

  function handleValue(key: string, val: any) {
    const elRef = ref?.[key];
    let thisVal = val;
    const cast =
      // elRef?.[0]?.getAttribute?.('cast') ||
      elRef?.getAttribute?.('cast');

    if (typeof cast === 'string') {
      if (notNull && (!thisVal || thisVal === '')) {
        thisVal = '';
      } else {
        thisVal = _formCastType(thisVal, cast);
      }
    }

    if (elRef?.type === 'file' && thisVal?.size && !(thisVal?.size > 0)) {
      thisVal = '';
    }

    return thisVal;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (typeof onSubmit === 'function') {
      const fd = new FormData(ref);

      let valid = true;
      const validArray = Object.entries(validations);

      if (validArray.length > 0) {
        type iterionType = [
          k: string,
          v: (obj: { castValue: any; realValue: any }) => any
        ];
        for (const iteration of validArray) {
          const [k, v] = iteration as iterionType;
          const elRef = ref?.[k];
          const realValue = fd.get(k);
          const castValue = handleValue(k, realValue);

          const thisValidation = elRef
            ? await v?.({ castValue, realValue })
            : true;

          valid = !(
            thisValidation === false || typeof thisValidation === 'string'
          );

          if (valid === false) {
            break;
          }
        }
      }

      if (valid) {
        if (isFormData) {
          onSubmit(fd, event);
        } else {
          let jsonFd = {};
          fd.forEach((v, name) => {
            const thisValue = handleValue(name, v);
            if (!notNull || thisValue === false || thisValue?.length > 0) {
              jsonFd = _formCreateNamePath(name, jsonFd, thisValue);
            }
          });
          onSubmit(jsonFd, event);
        }
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      ref={(e) => {
        if (e) {
          setRef(e);
        }
        if (typeof innerRef === 'function') {
          innerRef(e);
        }
      }}
      {...rest}
    >
      <formStore.Provider
        value={{
          setValidations: (name, validation) =>
            setValidations((prev) => ({ ...prev, [name]: validation })),
          getKeyValue: (name) => {
            let realValue = undefined;
            let castValue = undefined;
            if (name) {
              const fd = new FormData(ref);
              realValue = fd.get(name);
              castValue = handleValue(name, realValue);
            }
            return { realValue, castValue };
          },
        }}
      >
        {children}
      </formStore.Provider>
    </form>
  );
};

export default Form;
