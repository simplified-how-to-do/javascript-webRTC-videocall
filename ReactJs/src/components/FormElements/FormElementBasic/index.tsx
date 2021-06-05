/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-inner-declarations */
import React from 'react';
import IFormElementBasicProps from './types';
import _formCastType from '../utils/_formCastType';
import { formStore } from '../Form';

function isCheck(type: string | undefined) {
  return type === 'checkbox' || type === 'radio';
}

function checkValue({
  checked,
  type,
  value,
}: {
  checked: boolean;
  type: string | undefined;
  value: any;
}) {
  if (isCheck(type)) {
    return checked ? value : '';
  } else {
    return value;
  }
}

const FormElementBasic: React.FC<IFormElementBasicProps> = ({
  innerRef,
  setter,
  children,
  onChange,
  validation,
  cast: castProp,
  value: valueProp,
  defaultValue: defaultValueProp,
  ...rest
}) => {
  const { name, checked, validationMessage, defaultChecked, type } = rest || {};
  const [loadedValue, setLoadedValue] = React.useState(false);
  const [loadedDefault, setLoadedDefault] = React.useState(false);
  /**
   * @type {[(HTMLButtonElement|HTMLFieldSetElement|HTMLInputElement|HTMLOutputElement|HTMLSelectElement|HTMLTextAreaElement), import("react").SetStateAction]}
   */
  const [childrenRef, setChildrenRef] = React.useState(undefined as any);
  const formContext = React.useContext(formStore);

  const { cast, value, defaultValue } = React.useMemo(() => {
    const result = {
      cast: castProp,
      value: valueProp,
      defaultValue: defaultValueProp,
    };

    const allowCast =
      castProp === 'parse' || castProp === 'tryparse' || castProp === undefined;

    const stringfyValue =
      typeof valueProp === 'function' || typeof valueProp === 'object';
    const stringfyDefaultValue =
      typeof defaultValueProp === 'function' ||
      typeof defaultValueProp === 'object';

    if (allowCast && (stringfyValue || stringfyDefaultValue)) {
      result.cast = castProp === undefined ? 'tryparse' : castProp;
      result.value = stringfyValue ? JSON.stringify(valueProp) : valueProp;
      result.defaultValue = stringfyDefaultValue
        ? JSON.stringify(defaultValueProp)
        : defaultValueProp;
    }

    return result;
  }, [castProp, valueProp, defaultValueProp]);

  const callAllSetters = React.useCallback(
    (thisValue, thisChecked) => {
      const v = _formCastType(
        checkValue({ checked: thisChecked, value: thisValue, type }),
        cast
      );

      // Envia o value
      if (typeof setter === 'function') {
        setter(v);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, cast]
  );

  // Controle default;
  React.useEffect(() => {
    const validSetValue = !isCheck(type) && defaultValue;
    const validSetChecked = isCheck(type) && defaultChecked;
    if (!loadedDefault && (validSetValue || validSetChecked)) {
      setLoadedDefault(true);
      callAllSetters(value || defaultValue, defaultChecked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultChecked, defaultValue]);

  // Controle de value e checked;
  React.useEffect(() => {
    const validSetValue = !isCheck(type) && value;
    const validSetChecked = isCheck(type) && checked;
    if (loadedValue) {
      callAllSetters(value, checked);
    } else if (!loadedValue && (validSetValue || validSetChecked)) {
      setLoadedValue(true);
    }
  }, [callAllSetters, checked, loadedValue, type, value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: thisValue, checked: thisChecked } = e.currentTarget || {};

    if (!loadedValue) {
      callAllSetters(thisValue, thisChecked);
    }

    if (typeof onChange === 'function') {
      onChange(e);
    }
  }

  function handleRef(e: any) {
    if (e && e !== childrenRef) {
      setChildrenRef(e);
    }
    if (typeof innerRef === 'function') {
      innerRef(e);
    }
  }

  React.useEffect(() => {
    if (
      childrenRef &&
      name &&
      formContext &&
      typeof validation === 'function'
    ) {
      const { setValidations, getKeyValue } = formContext;

      const defaultValidationMessage = validationMessage || '';
      childrenRef.setCustomValidity(defaultValidationMessage);

      async function rollBackMessage() {
        const newResult = await validation?.({
          ...getKeyValue(name),
          ref: childrenRef,
        });

        if (typeof newResult === 'string' && newResult.length > 0) {
          childrenRef.setCustomValidity(newResult);
        } else {
          childrenRef.setCustomValidity(defaultValidationMessage);
        }
      }

      childrenRef.removeEventListener('input', rollBackMessage);
      setValidations(name, async (values: any) => {
        const result = await validation({ ...values, ref: childrenRef });

        if (typeof result === 'string' && result.length > 0) {
          childrenRef.setCustomValidity(result);
          childrenRef.reportValidity();

          childrenRef.addEventListener('input', rollBackMessage);
        }

        return result;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenRef, name, validation]);

  return children?.({
    onChange: handleChange,
    ref: handleRef,
    cast,
    value,
    defaultValue,
    ...rest,
  });
};

export default FormElementBasic;
