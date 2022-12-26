import { Input, InputProps, FormLabel } from '@chakra-ui/react';
import TextDecorated from '../Text/TextDecorated';

type InputFileProps = {
  label?: string;
  labelFontSize?: string;
} & InputProps;

export default function InputFile(props: InputFileProps) {
  return (
    <>
      {props.label && <TextDecorated mb='0.5rem' fontWeight={'bold'} fontSize={props.labelFontSize ?? 'md'}>{props.label}</TextDecorated>}{' '}
      <Input mt={'0.5rem'} type="file" accept="image/*" {...props} border="none" />
    </>
  );
}
