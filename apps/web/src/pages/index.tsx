import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { pagesEventsViewQuery } from '../../__generated__/pagesEventsViewQuery.graphql';
import EventsViewQueryGenerated from '../../__generated__/pagesEventsViewQuery.graphql';
import ProfileViewQueryGenerated from '../../__generated__/ProfileViewQuery.graphql';
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
    <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
      <EventsList fragmentKey={data} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['en', 'ptBR'])),
      preloadedQueries: {
        ProfileViewQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(
          EventsViewQueryGenerated,
          {
            first: 12,
            after: null,
          },
          ctx,
        ),
      },
    },
  };
}
