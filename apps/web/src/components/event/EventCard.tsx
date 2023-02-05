import { Box, Center, Flex, Image, Stack, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import timestampToDate from 'timestamp-to-date';

import { TextDecorated } from '@event-list/ui';

const EventCard = ({ event }) => {
  if (!event?.node) {
    return null;
  }

  return (
    <NextLink href={`/event/${event?.node?.id}`}>
      <Center py={12} cursor={'pointer'}>
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
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'230px'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 2,
              left: 0,
              backgroundImage: `url(${event?.node?.flyer ?? ''})`,
              filter: 'blur(15px)',
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(20px)',
              },
            }}
          >
            <Image
              alt="flyer"
              rounded={'lg'}
              height={250}
              width={282}
              objectFit={'cover'}
              src={event?.node?.flyer ?? ''}
            />
          </Box>
          <Stack pt={10} align={'center'}>
            <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
              {event?.node?.label.name}
            </Text>
            <TextDecorated fontSize={'2xl'} fontWeight={'bold'}>
              {event?.node?.title}
            </TextDecorated>
            <Box>
              <Text fontWeight={700} fontSize={'lg'}>
                {timestampToDate(event?.node?.date, 'dd-MM-yyyy')}
              </Text>
            </Box>
            <Flex alignItems="center" justifyContent="space-between" w="60%">
              <Box>
                <VStack spacing={0}>
                  <TextDecorated fontWeight={'semibold'} fontSize={'sm'}>
                    Open At
                  </TextDecorated>
                  <Text as={'span'} fontWeight={700} fontSize={'lg'}>
                    {event?.node?.eventOpenAt}
                  </Text>
                </VStack>
              </Box>
              <Box>
                <VStack spacing={0}>
                  <TextDecorated fontWeight={'semibold'} fontSize={'sm'}>
                    End At
                  </TextDecorated>
                  <Text as={'span'} fontWeight={700} fontSize={'lg'}>
                    {event?.node?.eventEndAt}
                  </Text>
                </VStack>
              </Box>
            </Flex>
          </Stack>
        </Box>
      </Center>
    </NextLink>
  );
};

export { EventCard };
