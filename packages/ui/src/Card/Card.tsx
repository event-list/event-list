import { Box, Center, Image, Stack, Text, Link, useColorModeValue, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';

import { TextDecorated } from '@event-list/ui';

type CardProps = {
  linkNavigation: string;
  urlImage: string;
  subTitle?: string;
  title: string;
  children?: React.ReactNode;
  imageHeight?: object;
};
const Card = (props: CardProps) => {
  return (
    <NextLink href={props.linkNavigation}>
      <Center
        as={Link}
        _hover={{
          textDecoration: 'none',
        }}
        href={props.linkNavigation}
        py={4}
        cursor={'pointer'}
      >
        <Box
          role={'group'}
          p={6}
          maxW={'330px'}
          w={'full'}
          // eslint-disable-next-line react-hooks/rules-of-hooks
          bg={useColorModeValue('gray.50', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}
        >
          <Flex
            rounded={'lg'}
            pos={'relative'}
            height={props.imageHeight ?? { base: 250, sm: 250 }}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 1,
              left: 0,
              backgroundImage: `url(${props.urlImage})`,
              filter: 'blur(7px)',
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(10px)',
              },
            }}
            justifyContent={'center'}
          >
            <Image
              alt="image"
              rounded={'lg'}
              height={props.imageHeight ?? { base: 250, sm: 250 }}
              width={282}
              objectFit={'cover'}
              src={props.urlImage}
            />
          </Flex>
          <Stack pt={8} align={'center'}>
            {props.subTitle && (
              <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'sm' }} textAlign={'center'}>
                {props.subTitle}
              </Text>
            )}
            <TextDecorated
              display={'flex'}
              alignItems={'center'}
              fontSize={{ base: 'lg', sm: '2xl' }}
              height={{ base: '12', sm: '16' }}
              fontWeight={'bold'}
              textAlign={'center'}
            >
              {props.title}
            </TextDecorated>
            {props.children}
          </Stack>
        </Box>
      </Center>
    </NextLink>
  );
};

export default Card;
