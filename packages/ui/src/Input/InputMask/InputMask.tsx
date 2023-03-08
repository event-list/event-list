import type { InputProps } from '@chakra-ui/react';
import { default as InputMaskPackage } from 'react-input-mask';
import type { Props as MaskProps } from 'react-input-mask';

import type { TextDecoratedProps } from '../../Text/TextFormLabel';
import InputField from '../InputField';

type InputMaskProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps &
  MaskProps;

const InputMask = (props: InputMaskProps) => {
  const { labelProps, ...restProps } = props;
  return <InputField as={InputMaskPackage} maskPlaceholder={null} {...restProps} labelProps={labelProps} />;
};

export default InputMask;
