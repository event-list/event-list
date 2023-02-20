import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { pagesEventsViewQuery } from '../../__generated__/pagesEventsViewQuery.graphql';
import EventsViewQueryGenerated from '../../__generated__/pagesEventsViewQuery.graphql';
import ProfileQueryGenerated from '../../__generated__/ProfileQuery.graphql';
import EventsList from '../components/event/EventsList';
import RootLayout from '../components/RootLayout';

const EventsViewQuery = graphql`
  query pagesEventsViewQuery {
    ...EventsListFragment_query
  }
`;

export default function Page(props) {
  const data = usePreloadedQuery<pagesEventsViewQuery>(EventsViewQuery, props.queryRefs.EventsViewQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <EventsList fragmentKey={data} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileQueryGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(
          EventsViewQueryGenerated,
          {
            published: true,
          },
          ctx,
        ),
      },
    },
  };
}
