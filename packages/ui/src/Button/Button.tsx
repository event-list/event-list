import { Button as ChakraButton, ButtonProps as ChakraButtonProps, Spinner } from '@chakra-ui/react'

type ButtonProps = {
  text: string
  isSubmitting: boolean
} & ChakraButtonProps

const Button = (props: ButtonProps) => {
  const { text = '', isSubmitting, ...restProps } = props
  return (
    <ChakraButton
      bgGradient='linear(to-r, red.500,pink.600)'
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
  )
}

export default Button
