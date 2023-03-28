import { graphql, usePreloadedQuery } from 'react-relay';

import type { eventsViewQuery } from '../../../__generated__/eventsViewQuery.graphql';
import EventsViewGenerated from '../../../__generated__/eventsViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import EventsList from '../../components/event/EventsList';
import RootLayout from '../../components/RootLayout';
import getPreloadedQuery from '../../relay/getPreloadedQuery';

const EventsView = graphql`
  query eventsViewQuery {
    ...EventsListFragment_query
  }
`;

export default function Page(props) {
  const key = usePreloadedQuery<eventsViewQuery>(EventsView, props.queryRefs.EventsViewQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <EventsList fragmentKey={key} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(EventsViewGenerated, {}, ctx),
      },
    },
  };
}
