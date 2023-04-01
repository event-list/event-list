import { FormLabel } from '@chakra-ui/react';
import type { FormLabelProps } from '@chakra-ui/react';

import { Tooltip } from '@event-list/ui';

import TextDecorated from './TextDecorated';

type TextDecoratedProps = {
  label?: string;
  decorated?: boolean;
  tooltip?: string;
} & FormLabelProps;

const TextFormLabel = (props: TextDecoratedProps) => {
  const { label, decorated, tooltip, ...restProps } = props;

  return (
    <FormLabel fontSize={{ base: '13px', md: '15px' }} fontWeight={'bold'} {...restProps}>
      <Tooltip label={tooltip}>{decorated ? <TextDecorated>{label}</TextDecorated> : label}</Tooltip>
    </FormLabel>
  );
};

export type { TextDecoratedProps };
export default TextFormLabel;
