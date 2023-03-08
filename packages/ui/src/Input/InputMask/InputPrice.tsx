import type { InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import { InputMask } from '../../index';
import type { TextDecoratedProps } from '../../Text/TextFormLabel';

type InputAgeProps = {
  label?: string;
  labelProps?: Omit<TextDecoratedProps, 'label'>;
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputPrice = (props: InputAgeProps) => {
  const { labelProps, ...restProps } = props;

  return <InputMask type="text" placeholder="R$00,00" {...restProps} labelProps={labelProps} mask={'R$9999'} />;
};

export default InputPrice;
