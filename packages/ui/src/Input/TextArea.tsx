import { FormLabel, TextareaProps, Textarea, Text } from '@chakra-ui/react';
import { useField } from 'formik';
import TextDecorated from '../Text/TextDecorated';

type TextAreaProps = {
  label?: string;
  labelFontSize?: string;
} & TextareaProps;

const TextArea = (props: TextAreaProps) => {
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
    //@ts-expect-error
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
      {label && <TextDecorated mb='0.5rem' fontWeight={'bold'} fontSize={props.labelFontSize ?? 'md'}>{label}</TextDecorated>}{' '}
      <Textarea
        mt="0.5rem"
        name={name}
        //@ts-expect-error
        onChange={handleChange}
        value={field.value}
        onBlur={handleBlur}
        {...textInputProps}
      />
      {meta?.error && meta?.touched ? (
        <Text color="red.600" fontSize={'sm'}>{meta.error}</Text>
      ) : null}
    </>
  );
};

export default TextArea;
