import { graphql, usePreloadedQuery } from 'react-relay';

import type { pagesEventsViewQuery } from '../../__generated__/pagesEventsViewQuery.graphql';
import RootLayoutGenerated from '../../__generated__/RootLayoutQuery.graphql';
import EventsTable from '../components/event/EventsTable';
import RootLayout from '../components/RootLayout';
import getPreloadedQuery from '../relay/getPreloadedQuery';

const EventsViewQuery = graphql`
  query pagesEventsViewQuery {
    ...EventsTableFragment_query
  }
`;

export default function Page(props) {
  const key = usePreloadedQuery<pagesEventsViewQuery>(EventsViewQuery, props.queryRefs.EventsViewQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.RootLayout}>
      <EventsTable fragmentKey={key} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        RootLayout: await getPreloadedQuery(RootLayoutGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(
          //@ts-expect-error todo
          EventsViewQuery,
          {},
          ctx,
        ),
      },
    },
  };
}
