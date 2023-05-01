import { CircularProgress, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { graphql, usePaginationFragment } from 'react-relay';

import { Hero } from '@event-list/ui';

import { EventCard } from './EventCard';
import type { EventsListFragment_query$key } from '../../../__generated__/EventsListFragment_query.graphql';
import type { EventsListPagination_query } from '../../../__generated__/EventsListPagination_query.graphql';

const EventsListFragment = graphql`
  fragment EventsListFragment_query on Query
  @argumentDefinitions(first: { type: Int, defaultValue: 12 }, after: { type: String })
  @refetchable(queryName: "EventsListPagination_query") {
    events(first: $first, after: $after) @connection(key: "Events_events", filters: []) {
      edges {
        node {
          ...EventFragment_event
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function EventsList(props: { fragmentKey: EventsListFragment_query$key }) {
  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    EventsListPagination_query,
    EventsListFragment_query$key
  >(EventsListFragment, props.fragmentKey);
  const { t } = useTranslation(['en', 'ptBR']);

  const events = data.events;

  if (!events.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px">
        <Text>{t('Events not found')}</Text>
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
      hasMore={events.pageInfo.hasNextPage}
      loader={infiniteScrollerLoader}
      useWindow
    >
      <Hero
        title={t('Events')}
        description={
          t('See all the events available for you to attend. Open one of the events to see more information about it')!
        }
      >
        <SimpleGrid
          minChildWidth="350px"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            lg: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
          spacing="20px"
        >
          {events.edges.map((event, index) => {
            if (event?.node) return <EventCard key={index} fragmentKey={event?.node} />;
          })}
        </SimpleGrid>
      </Hero>
    </InfiniteScroll>
  );
}
