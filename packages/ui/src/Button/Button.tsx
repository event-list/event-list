import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { Button as ChakraButton, Spinner } from '@chakra-ui/react';

type ButtonProps = {
  text: string | JSX.Element;
  isSubmitting: boolean;
  href?: string;
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
      {isSubmitting ? <Spinner /> : text}
    </ChakraButton>
  );
};

export default Button;
