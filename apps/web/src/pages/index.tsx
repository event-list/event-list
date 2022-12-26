import { graphql, usePreloadedQuery } from 'react-relay';
import EventsList from '../components/event/EventsList';
import { getPreloadedQuery } from '@event-list/relay';
import { pagesEventsViewQuery } from '../../__generated__/pagesEventsViewQuery.graphql';
import RootLayoutGenerated from '../../__generated__/RootLayoutQuery.graphql';
import RootLayout from '../components/RootLayout';

const EventsViewQuery = graphql`
  query pagesEventsViewQuery {
    ...EventsListFragment_query
  }
`;

export default function Page(props) {
  const data = usePreloadedQuery<pagesEventsViewQuery>(
    EventsViewQuery,
    props.queryRefs.EventsViewQuery
  );

  return (
    <RootLayout preloadedQuery={props.queryRefs.RootLayout}>
      <EventsList fragmentKey={data} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        RootLayout: await getPreloadedQuery(RootLayoutGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(EventsViewQuery, {}, ctx),
      },
    },
  };
}
