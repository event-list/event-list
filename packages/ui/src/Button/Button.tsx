import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { Button as ChakraButton, Spinner, Text } from '@chakra-ui/react';

import { TextDecorated } from '@event-list/ui';

type ButtonProps = {
  text: string | JSX.Element;
  isSubmitting: boolean;
  href?: string;
  textDecorated?: boolean;
} & ChakraButtonProps;

const Button = (props: ButtonProps) => {
  const { text = '', isSubmitting, ...restProps } = props;
  return (
    <ChakraButton
      bgGradient="linear(to-r, red.500,pink.600)"
      color={'white'}
      _hover={{
        bgGradient: 'linear(to-r, red.600,pink.700)',
        boxShadow: 'xl',
        transitionDuration: '2ms',
      }}
      {...restProps}
    >
      {isSubmitting ? <Spinner /> : props.textDecorated ? <TextDecorated>{text}</TextDecorated> : <Text>{text}</Text>}
    </ChakraButton>
  );
};

export default Button;
