import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import { InputMask } from '../../index';

type InputAgeProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputPrice = (props: InputAgeProps) => {
  const { labelProps, ...restProps } = props;

  return <InputMask type="text" placeholder="R$00,00" {...restProps} labelProps={labelProps} mask={'R$9999'} />;
};

export default InputPrice;
