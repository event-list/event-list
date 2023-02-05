import {
  CircularProgress,
  Flex,
  SimpleGrid,
  TableContainer,
  Text,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Stack,
} from '@chakra-ui/react';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import { graphql, usePaginationFragment } from 'react-relay';

import { TextDecorated } from '@event-list/ui';

import type { MyEventsListFragment_query$key } from '../../../__generated__/MyEventsListFragment_query.graphql';
import type { MyEventsListPagination_query } from '../../../__generated__/MyEventsListPagination_query.graphql';
import { EventRow } from './EventRow';

const myEventsListFragment = graphql`
  fragment MyEventsListFragment_query on Query
  @argumentDefinitions(first: { type: Int, defaultValue: 12 }, after: { type: String })
  @refetchable(queryName: "MyEventsListPagination_query") {
    myEvents(first: $first, after: $after) @connection(key: "Events_myEvents", filters: []) {
      edges {
        node {
          id
          title
          description
          slug
          flyer
          label {
            name
          }
          published
          date
          eventOpenAt
          eventEndAt
          listAvailableAt
          classification
          price
          place
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function MyEventsList(props: { fragmentKey: MyEventsListFragment_query$key }) {
  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    MyEventsListPagination_query,
    MyEventsListFragment_query$key
  >(myEventsListFragment, props.fragmentKey);

  const events = data.myEvents;

  // @ts-expect-error todo
  if (events.edges?.length <= 0 || !events.edges) {
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

  const infiniteScrollerLoader = (
    <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
      <CircularProgress color={'#E53E3E'} />
    </Flex>
  );

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={events.pageInfo?.hasNextPage}
      loader={infiniteScrollerLoader}
      useWindow
    >
      <Flex rounded={'xl'} p={{ base: 4, sm: 6, md: 8 }}>
        <Stack spacing={8} mx={'auto'} w={'100%'}>
          <Stack align={'center'}>
            <TextDecorated fontSize={'6xl'} fontWeight={'bold'} textAlign={'center'}>
              My events
            </TextDecorated>
          </Stack>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th fontFamily={'Sifonn'}>List</Th>
                  <Th fontFamily={'Sifonn'}>Name</Th>
                  <Th fontFamily={'Sifonn'}>Total confirmed</Th>
                  <Th fontFamily={'Sifonn'}>Date</Th>
                  <Th fontFamily={'Sifonn'}>Event open At</Th>
                  <Th fontFamily={'Sifonn'}>Price</Th>
                  <Th fontFamily={'Sifonn'}>Access</Th>
                </Tr>
              </Thead>
              <Tbody></Tbody>
              {events.edges.map((event, index) => (
                <EventRow key={index} event={event!.node} />
              ))}
            </Table>
          </TableContainer>
        </Stack>
      </Flex>
    </InfiniteScroll>
  );
}
