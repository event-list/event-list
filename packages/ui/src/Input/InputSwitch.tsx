import { Switch, Text } from '@chakra-ui/react';
import type { SwitchProps } from '@chakra-ui/react';
import { useField } from 'formik';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import TextFormLabel from '../Text/TextFormLabel';

type InputSwitchProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & SwitchProps;

const InputSwitch = (props: InputSwitchProps) => {
  const { name = '', label = null, ...restProps } = props;
  const [field, meta, helpers] = useField(name);

  const hasError = meta?.touched;

  const getErrorProps = () => {
    if (!hasError) {
      return {};
    }

    if (typeof meta?.error === 'string') {
      return {
        error: !!meta?.error,
        isInvalid: true,
        errorBorderColor: 'red.600',
      };
    }

    return {};
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked: value } = event.target;

    helpers.setValue(value);
  };

  const handleBlur = (event) => {
    field.onBlur(event);
  };

  const dataTestIdInputProps = {
    'data-testid': `${name}`,
  };

  const textInputProps = {
    ...dataTestIdInputProps,
    ...getErrorProps(),
    ...restProps,
  };

  return (
    <>
      {label && <TextFormLabel mt={'2'} fontSize={{ base: '13px', md: 'sm' }} label={label} {...props.labelProps} />}
      <Switch
        name={name}
        onChange={handleChange}
        isChecked={field.value}
        value={field.value}
        onBlur={handleBlur}
        {...textInputProps}
      />
      {meta?.error && meta?.touched ? (
        <Text color="red.600" fontSize={{ base: '12px', md: 'smaller' }} position={'absolute'}>
          {meta.error}
        </Text>
      ) : null}
    </>
  );
};

export default InputSwitch;
