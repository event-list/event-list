import { Text } from '@chakra-ui/react';
import { usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import Event from '../../components/event/Event';
import { getPreloadedQuery } from '@event-list/relay';
import RootLayout from '../../components/RootLayout';
import { IdEventViewQuery } from '../../../__generated__/IdEventViewQuery.graphql';
import RootLayoutGenerated from '../../../__generated__/RootLayoutQuery.graphql';

const EventViewQuery = graphql`
  query IdEventViewQuery($id: ID!) @preloadable {
    event: node(id: $id) {
      ...EventFragment_event
    }
  }
`;

export default function Page(props) {
  const { event } = usePreloadedQuery<IdEventViewQuery>(
    EventViewQuery,
    props.queryRefs.EventViewQuery
  );

  if (!event) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.RootLayout}>
        <Text>Event not found</Text>
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.RootLayout}>
      <Event fragmentKey={event} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        RootLayout: await getPreloadedQuery(RootLayoutGenerated, {}, ctx),
        EventViewQuery: await getPreloadedQuery(
          EventViewQuery,
          {
            id: ctx.params.id,
          },
          ctx
        ),
      },
    },
  };
}
