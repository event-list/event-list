import { Input } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import TextFormLabel from '../Text/TextFormLabel';

type InputFileProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps;

export default function InputFile(props: InputFileProps) {
  const { label = '' } = props;

  return (
    <>
      {label && <TextFormLabel label={label} {...props.labelProps} />}
      <Input type="file" accept="image/*" {...props} border="none" />
    </>
  );
}
