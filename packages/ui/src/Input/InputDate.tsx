import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import InputField from './InputField';

type InputDateProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputDate = (props: InputDateProps) => {
  const { labelProps, ...restProps } = props;

  const today = new Date().toISOString().split('T')[0];

  return <InputField type="date" min={today} {...restProps} labelProps={labelProps} />;
};

export default InputDate;
