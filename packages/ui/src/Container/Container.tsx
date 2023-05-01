import { Box, Flex, Stack, Heading, Text, HStack } from '@chakra-ui/react';
import type { ContainerProps as ContainerPropsChakra } from '@chakra-ui/react';

import type { LinkDecoratedProps } from '../Link/LinkDecorated';
import LinkDecorated from '../Link/LinkDecorated';

type ContainerProps = {
  fullSize?: boolean;
  title: string;
  description: string;
  buttonNav: LinkDecoratedProps;
  image: any;
} & ContainerPropsChakra;

const Container = (props: ContainerProps) => {
  const { fullSize = true, title, description, buttonNav, image } = props;

  if (!fullSize) {
    return (
      <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
        <Stack spacing={6}>
          <Flex justifyContent="space-between">
            <Stack>
              <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{title}</Heading>
              <Text fontSize="md">{description}</Text>
            </Stack>
            <Stack>
              <LinkDecorated target="_blank" w="10rem" {...buttonNav} />
            </Stack>
          </Flex>
          <Box>{image}</Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900">
      <Flex justifyContent="space-between">
        <Stack spacing={10}>
          <Stack>
            <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{title}</Heading>
            <Text fontSize="md">{description}</Text>
          </Stack>
          <LinkDecorated target="_blank" w="10rem" {...buttonNav} />
        </Stack>
        <Box>{image}</Box>
      </Flex>
    </Box>
  );
};

export default Container;
