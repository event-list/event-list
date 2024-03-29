import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  Link,
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
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'next-share';
import type { ReactNode } from 'react';
import { BsDoorClosedFill, BsDoorOpenFill } from 'react-icons/bs';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { MdFactCheck } from 'react-icons/md';
import { SiAdblock } from 'react-icons/si';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import timestampToDate from 'timestamp-to-date';

import { Button, TextDecorated } from '@event-list/ui';

import { EnsurePresence } from './mutations/EnsurePresenceMutation';
import type {
  EnsurePresenceMutation,
  EnsurePresenceMutation$data,
} from '../../../__generated__/EnsurePresenceMutation.graphql';
import type { EventFragment_event$key } from '../../../__generated__/EventFragment_event.graphql';

export const EventViewFragment = graphql`
  fragment EventFragment_event on Event {
    id
    title
    description
    flyer
    merchant {
      name
      id
    }
    published
    status
    dateStart
    dateEnd
    listAvailableAt
    classification
    currentBatch
    place
  }
`;

export default function EventView(props: { fragmentKey: EventFragment_event$key }) {
  const event = useFragment<EventFragment_event$key>(EventViewFragment, props.fragmentKey);
  const { t } = useTranslation(['en', 'ptBR']);

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

        onCompleted: ({ EventEnsurePresenceMutation }: EnsurePresenceMutation$data) => {
          if (typeof EventEnsurePresenceMutation === 'undefined') {
            toast({
              title: t('Something was wrong'),
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          if (EventEnsurePresenceMutation?.error) {
            toast({
              title: EventEnsurePresenceMutation?.error,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            return;
          }

          toast({
            title: EventEnsurePresenceMutation?.success,
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

  return (
    <FormikProvider value={formik}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 8, md: 10 }} py={{ base: 1, md: 7 }}>
        <Center>
          <Box rounded="lg" pos="relative">
            <Image rounded="lg" height={{ base: 500, md: 700 }} objectFit="cover" src={event?.flyer ?? ''} />
          </Box>
        </Center>
        <Stack spacing={{ base: 2 }} direction="column" divider={<StackDivider borderColor="transparent" py={1} />}>
          <Stack spacing={2}>
            <TextDecorated fontWeight="700" fontSize={{ base: '3xl', sm: '5xl', lg: '5xl' }}>
              {event.title}
            </TextDecorated>
            <Text fontWeight="700" fontSize={{ base: 'lg', sm: '2xl', lg: '2xl' }}>
              <NextLink href={`/merchant/${event.merchant.id}`} replace>
                <Link href={`/merchant/${event.merchant.id}`} isExternal={true}>
                  <ExternalLinkIcon ml="0.5rem" fontSize="md" />
                </Link>
              </NextLink>
            </Text>
            <Text textAlign="left" color={'gray'} fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }}>
              {event.description}
            </Text>
          </Stack>
          <Stack
            spacing={{ base: 2 }}
            direction={'column'}
            divider={<StackDivider borderColor={'transparent'} py={1} />}
          >
            <Stack>
              <TextDecorated fontSize={{ base: 'xl', sm: '1xl', lg: '1xl' }} fontWeight="700">
                {t('Share it')}
              </TextDecorated>
              <HStack spacing={2}>
                <WhatsappShareButton
                  url={document.URL}
                  title={`See '${event.title}' event in Event List app!`}
                  separator="

                "
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TwitterShareButton url={document.URL} title={`See '${event.title}' event in Event List app!`}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <FacebookShareButton url={document.URL} quote={`See '${event.title}' event in Event List app!`}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TelegramShareButton url={document.URL} title={`See '${event.title}' event in Event List app!`}>
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
              </HStack>
            </Stack>
            <Stack>
              <TextDecorated fontSize={{ base: 'xl', sm: '1xl', lg: '1xl' }} fontWeight="700">
                {t('Place')}
              </TextDecorated>
              <SimpleGrid columns={{ base: 1 }} spacing={10}>
                <List spacing={2}>
                  <ListItem>
                    <Text fontSize={{ base: 'small', sm: 'sm', lg: 'sm' }}>
                      <Link href={`https://maps.google.com/?q=${event.place}`} isExternal={true}>
                        {event.place} <ExternalLinkIcon ml={'0.5rem'} fontSize={'md'} />
                      </Link>
                    </Text>
                  </ListItem>
                </List>
              </SimpleGrid>
            </Stack>
            <Stack>
              <SimpleGrid columns={{ base: 2 }} spacing={{ base: 5, lg: 8 }}>
                <StatsCard title={t('Price')} stat={event.currentBatch ?? '00,00'} icon={<FaMoneyCheckAlt />} />
                <StatsCard title={t('Classification')} stat={event.classification ?? '18'} icon={<SiAdblock />} />
                <StatsCard
                  title={t('Start')}
                  stat={timestampToDate(event.dateStart, 'yyyy/MM/dd HH:mm')}
                  icon={<BsDoorOpenFill />}
                />
                <StatsCard
                  title={t('End')}
                  stat={timestampToDate(event.dateEnd, 'yyyy/MM/dd HH:mm')}
                  icon={<BsDoorClosedFill />}
                />
                <StatsCard
                  title={t('List available at')}
                  stat={timestampToDate(event.listAvailableAt, 'yyyy/MM/dd HH:mm')}
                  icon={<MdFactCheck />}
                />
              </SimpleGrid>
            </Stack>
            <Button
              loadingText={t('Submitting')!}
              isSubmitting={isPending}
              isDisabled={isDisabled}
              size="lg"
              text={t('I am going to this event')!}
              py="7"
              w="full"
              color="white"
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
      py="2"
      shadow="xl"
      border="1px solid"
      borderColor="gray.600"
      rounded="lg"
      bgColor="transparent"
      color="white"
    >
      <Flex justifyContent="space-between" alignContent="center" alignItems="center" px="1">
        <Stack w="100%" spacing="2">
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <TextDecorated fontWeight="500" fontSize={{ base: 'sm' }}>
              {title}
            </TextDecorated>
            <Box color="gray.200" alignContent="center" fontSize={{ base: '1rem', sm: '1.5rem' }}>
              {icon}
            </Box>
          </Flex>
          <StatNumber as={Text} fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }} color="gray.200">
            {stat}
          </StatNumber>
        </Stack>
      </Flex>
    </Stat>
  );
}
