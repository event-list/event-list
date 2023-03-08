import { InputGroup, InputLeftAddon as InputLeftAddonChakra } from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import InputField from './InputField';

type InputDateProps = {
  leftAddon: string;
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputLeftAddon = (props: InputDateProps) => {
  const { labelProps, leftAddon, ...restProps } = props;

  return (
    <InputGroup>
      <InputLeftAddonChakra>{leftAddon}</InputLeftAddonChakra>
      <InputField {...restProps} labelProps={labelProps} />
    </InputGroup>
  );
};

export default InputLeftAddon;
