import { Input } from '@chakra-ui/react';
import type { InputProps, FormLabelProps } from '@chakra-ui/react';
import TextDecorated from '../Text/TextDecorated';
import TextFormLabel from '../Text/TextFormLabel';

type InputFileProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps;

export default function InputFile(props: InputFileProps) {
  const { label = '' } = props;

  return (
    <>
      {label && <TextFormLabel label={label} {...props.labelProps} />}
      <Input
        mt={'0.5rem'}
        type="file"
        accept="image/*"
        {...props}
        border="none"
      />
    </>
  );
}
