import { Input, InputGroup, Text, InputLeftElement as InputLeftElementChakra } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import { useField } from 'formik';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import TextFormLabel from '../Text/TextFormLabel';

type InputLeftElementProps = {
  leftElementChildren: JSX.Element;
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps;

const InputLeftElement = (props: InputLeftElementProps) => {
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
    const { value } = event.target;

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
      {label && <TextFormLabel mt={'2'} label={label} {...props.labelProps} />}
      <InputGroup>
        <InputLeftElementChakra pointerEvents="none">{props.leftElementChildren}</InputLeftElementChakra>
        <Input
          name={name}
          fontSize={{ base: '13px', md: 'sm' }}
          onChange={handleChange}
          value={field.value}
          onBlur={handleBlur}
          {...textInputProps}
        />
      </InputGroup>
      {meta?.error && meta?.touched ? (
        <Text color="red.600" fontSize={{ base: '12px', md: 'smaller' }} position={'absolute'}>
          {meta.error}
        </Text>
      ) : null}
    </>
  );
};

export default InputLeftElement;
