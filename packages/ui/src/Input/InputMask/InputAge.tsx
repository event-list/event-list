import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import { InputMask } from '../../index';

type InputAgeProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputAge = (props: InputAgeProps) => {
  const { labelProps, ...restProps } = props;

  return <InputMask type="text" placeholder="18+" {...restProps} labelProps={labelProps} mask="99" />;
};

export default InputAge;
