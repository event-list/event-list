import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import InputMask from './InputMask';

type InputCnpjProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputCnpj = (props: InputCnpjProps) => {
  const { labelProps, ...restProps } = props;

  return (
    <InputMask mask={'99.999.999/9999-99'} maskPlaceholder={null} {...props} {...restProps} labelProps={labelProps} />
  );
};

export default InputCnpj;
