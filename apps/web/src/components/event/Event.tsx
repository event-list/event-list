import {
  Box,
  Center,
  Flex,
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
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import {
  BsDoorClosedFill,
  BsDoorOpenFill,
  BsFillCalendarDateFill,
} from 'react-icons/bs';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { MdFactCheck } from 'react-icons/md';
import { SiAdblock } from 'react-icons/si';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import timestampToDate from 'timestamp-to-date';
import { EventFragment_event$key } from '../../../__generated__/EventFragment_event.graphql';
import { Button, TextDecorated } from '@event-list/ui';

const EventFragment = graphql`
  fragment EventFragment_event on Event {
    id
    title
    description
    slug
    flyer
    label
    published
    date
    eventOpenAt
    eventEndAt
    listAvailableAt
    classification
    price
  }
`;

export default function Event(props: { fragmentKey: EventFragment_event$key }) {
  const event = useFragment<EventFragment_event$key>(
    EventFragment,
    props.fragmentKey
  );

  return (
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 1, md: 7 }}
    >
      <Center>
        <Box rounded={'lg'} pos={'relative'}>
          <Image
            rounded={'lg'}
            width={632}
            objectFit={'cover'}
            src={event?.flyer ?? ''}
          />
        </Box>
      </Center>
      <Stack spacing={{ base: 1, md: 5 }}>
        <Box as={'header'}>
          <TextDecorated
            lineHeight={1.1}
            fontWeight={'bold'}
            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}
          >
            {event.title}
          </TextDecorated>
          <Text
            color={useColorModeValue('gray.700', 'gray.200')}
            fontWeight={300}
            fontSize={'2xl'}
          >
            {event.label}
          </Text>
        </Box>

        <Stack
          spacing={{ base: 2, sm: 4 }}
          direction={'column'}
          divider={
            <StackDivider
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            />
          }
        >
          <Text
            textAlign="left"
            color={useColorModeValue('gray.500', 'gray.400')}
            fontSize={'lg'}
          >
            {event.description}
          </Text>
          <Box>
            <TextDecorated
              fontSize={{ base: '16px', lg: '18px' }}
              fontWeight={'semibold'}
              textTransform={'uppercase'}
              mb={'4'}
            >
              Place
            </TextDecorated>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <List spacing={2}>
                <ListItem>
                  <Text>wip</Text>
                </ListItem>
              </List>
            </SimpleGrid>
          </Box>

          <Box>
            <SimpleGrid
              columns={{ base: 2, md: 3 }}
              spacing={{ base: 5, lg: 8 }}
            >
              <StatsCard
                title={'Price'}
                stat={`R$${event.price},00` ?? '00,00'}
                icon={<FaMoneyCheckAlt size={'2.2rem'} />}
              />
              <StatsCard
                title={'Date'}
                stat={timestampToDate(event.date, 'yyyy-MM-dd')}
                icon={<BsFillCalendarDateFill size={'2.2rem'} />}
              />
              <StatsCard
                title={'Classification'}
                stat={(event.classification ?? '18') + '+'}
                icon={<SiAdblock size={'2.2em'} />}
              />
              <StatsCard
                title={'Event open At'}
                stat={(event.eventOpenAt ?? 'not available') + 'hrs'}
                icon={<BsDoorOpenFill size={'2.2em'} />}
              />
              <StatsCard
                title={'Event end At'}
                stat={(event.eventEndAt ?? 'not available') + 'hrs'}
                icon={<BsDoorClosedFill size={'2.2em'} />}
              />
              <StatsCard
                title={'List available At'}
                stat={(event.eventEndAt ?? 'not available') + 'hrs'}
                icon={<MdFactCheck size={'2.2em'} />}
              />
            </SimpleGrid>
          </Box>
        </Stack>
        <Button
          loadingText="Submitting"
          size={'lg'}
          mt={8}
          text={'I am going to this event'}
          py={'7'}
          w={'full'}
          color={'white'}
          isSubmitting={false}
        />
      </Stack>
    </SimpleGrid>
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
      py={'3'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.700', 'gray.600')}
      rounded={'lg'}
      bgColor="transparent"
      color={'white'}
      _hover={{
        transform: 'translateY(5px)',
        boxShadow: 'xl',
        transitionDuration: '20ms',
      }}
    >
      <Flex
        justifyContent={'space-between'}
        alignContent="center"
        alignItems={'center'}
        px={'1'}
      >
        <Box>
          <TextDecorated fontWeight={'base'}>{title}</TextDecorated>
          <StatNumber as={Text} fontSize={'md'} fontWeight={'medium'} color={useColorModeValue('gray.700', 'gray.200')}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          color={useColorModeValue('gray.700', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}
