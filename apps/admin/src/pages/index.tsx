import { graphql, usePreloadedQuery } from 'react-relay';

import type { pagesEventsViewQuery } from '../../__generated__/pagesEventsViewQuery.graphql';
import RootLayoutGenerated from '../../__generated__/RootLayoutQuery.graphql';
import MyEventsList from '../components/event/MyEventsList';
import RootLayout from '../components/RootLayout';
import getPreloadedQuery from '../relay/getPreloadedQuery';

const myEventsViewQuery = graphql`
  query pagesEventsViewQuery {
    ...MyEventsListFragment_query
  }
`;

export default function Page(props) {
  const key = usePreloadedQuery<pagesEventsViewQuery>(myEventsViewQuery, props.queryRefs.myEventsViewQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.RootLayout}>
      <MyEventsList fragmentKey={key} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        RootLayout: await getPreloadedQuery(RootLayoutGenerated, {}, ctx),
        myEventsViewQuery: await getPreloadedQuery(
          //@ts-expect-error todo
          myEventsViewQuery,
          {
            published: true,
          },
          ctx,
        ),
      },
    },
  };
}
