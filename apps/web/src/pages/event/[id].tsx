import { Text } from '@chakra-ui/react';
import { usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { getPreloadedQuery } from '@event-list/relay';

import type { IdEventViewQuery } from '../../../__generated__/IdEventViewQuery.graphql';
import IdEventViewQueryGenerated from '../../../__generated__/IdEventViewQuery.graphql';
import ProfileQueryGenerated from '../../../__generated__/ProfileQuery.graphql';
import EventView from '../../components/event/EventView';
import RootLayout from '../../components/RootLayout';

const EventViewQuery = graphql`
  query IdEventViewQuery($id: ID!) @preloadable {
    event: node(id: $id) {
      ...EventViewFragment_event
    }
  }
`;

export default function Page(props) {
  const { event } = usePreloadedQuery<IdEventViewQuery>(EventViewQuery, props.queryRefs.EventViewQuery);

  if (!event) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
        <Text>Event not found</Text>
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <EventView fragmentKey={event} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileQueryGenerated, {}, ctx),
        EventViewQuery: await getPreloadedQuery(
          IdEventViewQueryGenerated,
          {
            id: ctx.params.id,
          },
          ctx,
        ),
      },
    },
  };
}
