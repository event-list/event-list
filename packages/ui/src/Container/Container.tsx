import { Box, Flex, Stack, Heading, Text, Grid } from '@chakra-ui/react';
import type { ContainerProps as ContainerPropsChakra } from '@chakra-ui/react';

import type { LinkDecoratedProps } from '../Link/LinkDecorated';
import LinkDecorated from '../Link/LinkDecorated';

type ContainerProps = {
  title: string;
  description: string;
  buttonNav: LinkDecoratedProps;
  image: any;
} & ContainerPropsChakra;

const Container = (props: ContainerProps) => {
  const { title, description, buttonNav, image, ...rest } = props;

  return (
    <Box w="full" rounded="lg" px={8} py={6} bgColor="gray.900" position="relative" {...rest}>
      <Grid templateColumns={{ base: '1fr', md: '10fr 1fr' }} gap={4}>
        <Stack spacing={10}>
          <Stack>
            <Heading fontSize={{ base: 'lg', sm: '2xl' }}>{title}</Heading>
            <Text fontSize="md">{description}</Text>
          </Stack>
          <LinkDecorated target="_blank" w="10rem" {...buttonNav} />
        </Stack>
        <Box width="200px" position="relative">
          {image}
        </Box>
      </Grid>
    </Box>
  );
};

export default Container;
