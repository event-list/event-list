import type { InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import type { TextDecoratedProps } from '../Text/TextFormLabel';
import InputField from './InputField';

type InputDateProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputDate = (props: InputDateProps) => {
  const { labelProps, ...restProps } = props;

  const today = new Date().toISOString().split('T')[0];

  return <InputField type="datetime-local" min={today} {...restProps} labelProps={labelProps} />;
};

export default InputDate;
