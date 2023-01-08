import { FormLabel, Input, Text } from '@chakra-ui/react';
import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import TextDecorated from '../Text/TextDecorated';
import TextFormLabel from '../Text/TextFormLabel';

type InputFieldProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps;

const InputField = (props: InputFieldProps) => {
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

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    // @ts-expect-error
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
      {label && <TextFormLabel label={label} {...props.labelProps} />}
      <Input
        name={name}
        onChange={handleChange}
        value={field.value}
        onBlur={handleBlur}
        {...textInputProps}
      />
      {meta?.error && meta?.touched ? (
        <Text color="red.600" fontSize={'sm'}>
          {meta.error}
        </Text>
      ) : null}
    </>
  );
};

export default InputField;
