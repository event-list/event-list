import { FormLabel, Text } from '@chakra-ui/react';
import type { FormLabelProps } from '@chakra-ui/react';
import TextDecorated from './TextDecorated';

type TextDecoratedProps = {
  label: string;
  decorated?: boolean;
} & FormLabelProps;

const TextFormLabel = (props: TextDecoratedProps) => {
  const { label, decorated, ...restProps } = props;

  return (
    <FormLabel as={Text} {...restProps}>
      {decorated ? <TextDecorated>{label}</TextDecorated> : label}
    </FormLabel>
  );
};

export default TextFormLabel;
