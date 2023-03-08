import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

type TextDecoratedProps = TextProps & {
  children: React.ReactNode;
};

const TextDecorated = (props: TextDecoratedProps) => {
  return <Text as={'span'} bgClip="text" bgGradient="linear(to-r, red.500,pink.600)" {...props} />;
};

export default TextDecorated;
