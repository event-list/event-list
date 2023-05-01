import { Select, Text, FormControl } from '@chakra-ui/react';
import type { SelectProps } from '@chakra-ui/react';
import { useField } from 'formik';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import TextFormLabel from '../Text/TextFormLabel';

type Options = {
  value: string;
  label: string;
};

type InputSelectProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
  options: Options[];
} & SelectProps;

const InputSelect = (props: InputSelectProps) => {
  const { name = '', label = null, isRequired = true, ...restProps } = props;
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    <FormControl id={name} isRequired={isRequired} mb="3">
      {label && <TextFormLabel mt={'2'} label={label} {...props.labelProps} />}
      <Select
        placeholder={'Select a option'}
        name={name}
        fontSize={{ base: '13px', md: 'sm' }}
        onChange={handleChange}
        value={field.value}
        onBlur={handleBlur}
        {...textInputProps}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {meta?.error && meta?.touched ? (
        <Text color="red.600" fontSize={{ base: '12px', md: 'smaller' }} position={'absolute'}>
          {meta.error}
        </Text>
      ) : null}
    </FormControl>
  );
};

export default InputSelect;
