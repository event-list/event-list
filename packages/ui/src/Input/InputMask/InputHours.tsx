import type { InputProps } from '@chakra-ui/react';
import type { Props as MaskProps } from 'react-input-mask';

import { InputMask } from '../../index';
import type { TextDecoratedProps } from '../../Text/TextFormLabel';

type InputHoursProps = {
  label?: string;
  labelProps?: TextDecoratedProps;
} & InputProps &
  Omit<MaskProps, 'mask'>;

const InputHours = (props: InputHoursProps) => {
  const { labelProps, ...restProps } = props;

  return (
    <InputMask type="text" {...restProps} labelProps={labelProps} mask={[/[0-2]/, /[0-4]/, ':', /[0-5]/, /[0-9]/]} />
  );
};

export default InputHours;
