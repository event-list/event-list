import type { InputProps } from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import type { Props as MaskProps } from 'react-input-mask';

import TextField from '../TextField';

type TextMaskMaskProps = {
  label?: string;
  labelFontSize?: string;
  decorated?: boolean;
} & InputProps &
  MaskProps;

const TextMask = (props: TextMaskMaskProps) => {
  return <TextField as={InputMask} maskPlaceholder={null} {...props} labelFontSize={props.labelFontSize ?? 'md'}/>;
};

export default TextMask;
