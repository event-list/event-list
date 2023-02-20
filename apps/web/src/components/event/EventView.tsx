import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  StackDivider,
  Stat,
  StatNumber,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import type { ReactNode } from 'react';
import { BsDoorClosedFill, BsDoorOpenFill, BsFillCalendarDateFill } from 'react-icons/bs';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { MdFactCheck } from 'react-icons/md';
import { SiAdblock } from 'react-icons/si';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import timestampToDate from 'timestamp-to-date';

import { Button, TextDecorated } from '@event-list/ui';

import type {
  EnsurePresenceMutation,
  EnsurePresenceMutation$data,
} from '../../../__generated__/EnsurePresenceMutation.graphql';
import type { EventViewFragment_event$key } from '../../../__generated__/EventViewFragment_event.graphql';
import { EnsurePresence } from './mutations/EnsurePresenceMutation';

export const EventViewFragment = graphql`
  fragment EventViewFragment_event on Event {
    id
    title
    description
    flyer
    label {
      name
    }
    published
    status
    date
    eventOpenAt
    eventEndAt
    listAvailableAt
    classification
    price
    place
  }
`;

export default function EventView(props: { fragmentKey: EventViewFragment_event$key }) {
  const event = useFragment<EventViewFragment_event$key>(EventViewFragment, props.fragmentKey);

  const colorLabel = useColorModeValue('gray.700', 'gray.200');
  const colorDescription = useColorModeValue('gray.500', 'gray.400');

  const toast = useToast();

  const [EnsurePresenceEvent, isPending] = useMutation<EnsurePresenceMutation>(EnsurePresence);

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      const config = {
        variables: {
          input: {
            eventId: event.id,
          },
        },

        onCompleted: ({ EnsurePresenceMutation }: EnsurePresenceMutation$data) => {
          if (typeof EnsurePresenceMutation === 'undefined') {
            toast({
              title: 'Something was wrong',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          if (EnsurePresenceMutation?.error) {
            toast({
              title: EnsurePresenceMutation?.error,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          toast({
            title: EnsurePresenceMutation?.success,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
      };

      EnsurePresenceEvent(config);
    },
  });

  const { handleSubmit } = formik;

  const isDisabled = isPending;

  if (!event || !event.status || !event.published)
    return (
      <Center>
        <Text> Event not found or not published yet</Text>
      </Center>
    );

  return (
    <FormikProvider value={formik}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 1, md: 7 }}>
        <Center>
          <Box rounded={'lg'} pos={'relative'}>
            <Image rounded={'lg'} width={632} objectFit={'cover'} src={event?.flyer ?? ''} />
          </Box>
        </Center>
        <Stack spacing={{ base: 5 }}>
          <Box as={'header'}>
            <TextDecorated lineHeight={1.1} fontWeight={'bold'} fontSize={{ base: '4xl', sm: '5xl', lg: '5xl' }}>
              {event.title}
            </TextDecorated>
            <Text color={colorLabel} fontWeight={300} fontSize={{ base: 'xl', sm: '2xl', lg: '2xl' }}>
              {event.label?.name}
            </Text>
            <Text textAlign="left" color={colorDescription} fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }}>
              {event.description}
            </Text>
          </Box>
          <Stack
            spacing={{ base: 5 }}
            direction={'column'}
            divider={<StackDivider borderColor={'transparent'} py={1} />}
          >
            <Box>
              <TextDecorated fontSize={{ base: 'xl', sm: '1xl', lg: '1xl' }}>Place</TextDecorated>
              <SimpleGrid columns={{ base: 1 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>
                    <Text fontSize={{ base: 'small', sm: 'sm', lg: 'sm' }}>{event.place}</Text>
                  </ListItem>
                </List>
              </SimpleGrid>
            </Box>
            <Box>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                <StatsCard title={'Price'} stat={event.price ?? '00,00'} icon={<FaMoneyCheckAlt />} />
                <StatsCard
                  title={'Date'}
                  stat={timestampToDate(event.date, 'yyyy-MM-dd')}
                  icon={<BsFillCalendarDateFill />}
                />
                <StatsCard title={'Classification'} stat={event.classification ?? '18'} icon={<SiAdblock />} />
                <StatsCard
                  title={'Event open At'}
                  stat={event.eventOpenAt ?? 'not available'}
                  icon={<BsDoorOpenFill />}
                />
                <StatsCard
                  title={'Event end At'}
                  stat={event.eventEndAt ?? 'not available'}
                  icon={<BsDoorClosedFill />}
                />
                <StatsCard
                  title={'List available At'}
                  stat={event.eventEndAt ?? 'not available'}
                  icon={<MdFactCheck />}
                />
              </SimpleGrid>
            </Box>
            <Button
              loadingText="Submitting"
              isSubmitting={isPending}
              isDisabled={isDisabled}
              size={'lg'}
              text={'I am going to this event'}
              py={'7'}
              w={'full'}
              color={'white'}
              onClick={() => handleSubmit()}
            />
          </Stack>
        </Stack>
      </SimpleGrid>
    </FormikProvider>
  );
}

type StatsCardProps = {
  title: string;
  stat: string;
  icon: ReactNode;
};

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon } = props;
  return (
    <Stat
      px={{ base: 1, md: 3 }}
      py={'2'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.700', 'gray.600')}
      rounded={'lg'}
      bgColor="transparent"
      color={'white'}
    >
      <Flex justifyContent={'space-between'} alignContent="center" alignItems={'center'} px={'1'}>
        <Stack w={'100%'} spacing={2}>
          <Flex justifyContent={'space-between'} alignItems={'center'} w={'100%'}>
            <TextDecorated fontWeight={'base'} fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }}>
              {title}
            </TextDecorated>
            <Box
              color={useColorModeValue('gray.700', 'gray.200')}
              alignContent={'center'}
              fontSize={{ base: '1rem', sm: '1.5rem' }}
            >
              {icon}
            </Box>
          </Flex>
          <StatNumber
            as={Text}
            fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }}
            fontWeight={'medium'}
            color={useColorModeValue('gray.700', 'gray.200')}
          >
            {stat}
          </StatNumber>
        </Stack>
      </Flex>
    </Stat>
  );
}
