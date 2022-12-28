import { SimpleGrid, Text } from '@chakra-ui/react';
import { graphql, usePaginationFragment } from 'react-relay';
import { EventsListFragment_query$key } from '../../../__generated__/EventsListFragment_query.graphql';
import { EventsListPagination_query } from '../../../__generated__/EventsListPagination_query.graphql';
import { EventCard } from './EventCard';

const EventsListFragment = graphql`
  fragment EventsListFragment_query on Query
  @argumentDefinitions(
    first: { type: Int, defaultValue: 20 }
    after: { type: String }
  )
  @refetchable(queryName: "EventsListPagination_query") {
    events(first: $first, after: $after) @connection(key: "Events_events") {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function EventsList(props: {
  fragmentKey: EventsListFragment_query$key;
}) {
  const { data, loadNext } = usePaginationFragment<
    EventsListPagination_query,
    EventsListFragment_query$key
  >(EventsListFragment, props.fragmentKey);

  const events = data.events;

  if (!events.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px">
        <Text>Events not found</Text>
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid minChildWidth="350px" spacing="20px">
      {events.edges.map((event) => (
        <EventCard event={event} />
      ))}
    </SimpleGrid>
  );
}
