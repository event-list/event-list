import { FormLabel, Input, InputProps, Text } from '@chakra-ui/react';
import { useField } from 'formik';
import TextDecorated from '../Text/TextDecorated';

type TextFieldProps = {
  label?: string;
  labelFontSize?: string;
  decorated?: boolean;
} & InputProps;

const TextField = (props: TextFieldProps) => {
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
      {label &&
        (props.decorated ? (
          <TextDecorated
            fontWeight={'bold'}
            fontSize={props.labelFontSize ?? 'md'}
          >
            {label}
          </TextDecorated>
        ) : (
          <FormLabel as={Text}>{label}</FormLabel>
        ))}
      <Input
        mt="0.5rem"
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

export default TextField;
