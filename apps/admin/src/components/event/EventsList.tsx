import {
  CircularProgress,
  Flex,
  SimpleGrid,
  TableContainer,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Center,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { graphql, usePaginationFragment } from 'react-relay';

import { Hero, TextDecorated, Tooltip } from '@event-list/ui';

import { EventRow } from './table/EventRow';
import type { EventsListFragment_query$key } from '../../../__generated__/EventsListFragment_query.graphql';
import type { EventsListPagination_query } from '../../../__generated__/EventsListPagination_query.graphql';

const EventsListFragment = graphql`
  fragment EventsListFragment_query on Query
  @argumentDefinitions(first: { type: Int, defaultValue: 12 }, after: { type: String })
  @refetchable(queryName: "EventsListPagination_query") {
    myEvents(first: $first, after: $after) @connection(key: "Events_myEvents", filters: []) {
      edges {
        node {
          ...EventRowFragment_event
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const ThTooltip = ({ label, children }) => {
  return (
    <Th fontFamily={'Noto Sans'}>
      <Tooltip label={label}>{children}</Tooltip>
    </Th>
  );
};

export default function EventsList(props: { fragmentKey: EventsListFragment_query$key }) {
  const { t } = useTranslation(['ptBR', 'en']);
  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    EventsListPagination_query,
    EventsListFragment_query$key
  >(EventsListFragment, props.fragmentKey);

  const events = data.myEvents;

  if (!events || !events.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px" textAlign={'center'}>
        <Text>
          {t('You do not have events yet')},{' '}
          <TextDecorated>
            <Link href={'/share-your-event'}>{t('share here!')}</Link>
          </TextDecorated>
        </Text>
      </SimpleGrid>
    );
  }

  const loadMore = () => {
    if (isLoadingNext) {
      return;
    }
    loadNext(4);
  };

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={events.pageInfo?.hasNextPage}
      loader={
        <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
          <CircularProgress color={'#E53E3E'} />
        </Flex>
      }
      useWindow
    >
      <Hero
        title={t('My events')}
        description={t(
          'All your events in one place. View the guest list, edit your information, add names, this is where you take control of your event',
        )}
      >
        <TableContainer>
          <Table variant={t('Simple')}>
            <Thead>
              <Tr>
                <ThTooltip label={t('View the guest list of the event')}>{t('List')}</ThTooltip>
                <ThTooltip label={t('Event name')}>{t('Name')}</ThTooltip>
                <ThTooltip label={t('Number of people on the event list')}>{t('Total')}</ThTooltip>
                <ThTooltip label={t('Date start')}>{t('Date start')}</ThTooltip>
                <ThTooltip label={t('List available at')}>{t('List available at')}</ThTooltip>
                <ThTooltip label={t('Informative event price')}>{t('Price')}</ThTooltip>
                <ThTooltip label={t('Defined by your event date')}>{t('Published')}</ThTooltip>
                <ThTooltip label={t('Defined by you')}>{t('Status')}</ThTooltip>
                <ThTooltip label={t('Access event page')}>{t('Access')}</ThTooltip>
                <ThTooltip label={t('Actions that you can do with this event')}>{t('Actions')}</ThTooltip>
              </Tr>
            </Thead>
            <Tbody>
              {events.edges.map((event, index) => {
                if (event?.node) return <EventRow key={index} fragmentKey={event?.node} />;
              })}
            </Tbody>
          </Table>
          {events.edges.length < 1 && (
            <TextDecorated display={'flex'} fontWeight={'700'} justifyContent={'center'} mt={6}>
              {t('You do not have events yet, share one to see it here')}
            </TextDecorated>
          )}
        </TableContainer>
      </Hero>
    </InfiniteScroll>
  );
}
