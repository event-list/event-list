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
} from '@chakra-ui/react';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import { graphql, usePaginationFragment } from 'react-relay';

import { ContainerPage, TextDecorated, Tooltip } from '@event-list/ui';

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
  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    EventsListPagination_query,
    EventsListFragment_query$key
  >(EventsListFragment, props.fragmentKey);

  const events = data.myEvents;

  if (!events || !events.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px" textAlign={'center'}>
        <Text>
          You do not have events yet,{' '}
          <TextDecorated>
            <Link href={'/share-your-event'}>share here!</Link>
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
      <ContainerPage title={'My events'}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <ThTooltip label={'View the guest list of the event'}>List</ThTooltip>
                <ThTooltip label={'Event name'}>Name</ThTooltip>
                <ThTooltip label={'Number of people on the event list'}>Total</ThTooltip>
                <ThTooltip label={'Date Start'}>Date Start</ThTooltip>
                <ThTooltip label={'List available at'}>List available at</ThTooltip>
                <ThTooltip label={'Informative event price'}>Price</ThTooltip>
                <ThTooltip label={'Defined by your event date'}>Published</ThTooltip>
                <ThTooltip label={'Defined by you'}>Status</ThTooltip>
                <ThTooltip label={'Access event page'}>Access</ThTooltip>
                <ThTooltip label={'Actions that you can do with this event'}>Actions</ThTooltip>
              </Tr>
            </Thead>
            <Tbody>
              {events.edges.map((event, index) => {
                if (event?.node) return <EventRow key={index} fragmentKey={event?.node} />;
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </ContainerPage>
    </InfiniteScroll>
  );
}
