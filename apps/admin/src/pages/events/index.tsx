import { graphql, usePreloadedQuery } from 'react-relay';

import type { eventsViewQuery } from '../../../__generated__/eventsViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import EventsTable from '../../components/event/EventsTable';
import RootLayout from '../../components/RootLayout';
import getPreloadedQuery from '../../relay/getPreloadedQuery';

const EventsView = graphql`
  query eventsViewQuery {
    ...EventsTableFragment_query
  }
`;

export default function Page(props) {
  const key = usePreloadedQuery<eventsViewQuery>(EventsView, props.queryRefs.EventsViewQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <EventsTable fragmentKey={key} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(
          //@ts-expect-error todo
          EventsView,
          {},
          ctx,
        ),
      },
    },
  };
}
