import { Text, TextProps } from '@chakra-ui/react';

type TextDecoratedProps = TextProps & {
  children: React.ReactNode
}

const TextDecorated = (props: TextDecoratedProps) => {
  return (
    <Text
      bgClip="text"
      as={'span'}
      bgGradient="linear(to-r, red.500,pink.600)"
      {...props}
    />
  );
};

export default TextDecorated