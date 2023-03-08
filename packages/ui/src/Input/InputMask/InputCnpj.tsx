import type { InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import type { TextDecoratedProps } from '../../Text/TextFormLabel';
import InputMask from './InputMask';

type InputCnpjProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputCnpj = (props: InputCnpjProps) => {
  const { labelProps, ...restProps } = props;

  return (
    <InputMask mask={'99.999.999/9999-99'} maskPlaceholder={null} {...props} {...restProps} labelProps={labelProps} />
  );
};

export default InputCnpj;
