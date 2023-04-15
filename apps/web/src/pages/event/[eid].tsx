import { Text } from '@chakra-ui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import { getPreloadedQuery } from '@event-list/relay';

import type { EidEventViewQuery } from '../../../__generated__/EidEventViewQuery.graphql';
import EidEventViewQueryGenerated from '../../../__generated__/EidEventViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import EventView from '../../components/event/Event';
import RootLayout from '../../components/RootLayout';

const EventViewQuery = graphql`
  query EidEventViewQuery($id: ID!) @preloadable {
    event: node(id: $id) {
      ...EventFragment_event
    }
  }
`;

export default function Page(props) {
  const { event } = usePreloadedQuery<EidEventViewQuery>(EventViewQuery, props.queryRefs.EventViewQuery);

  if (!event) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
        <Text>Event not found</Text>
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
      <EventView fragmentKey={event} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileViewQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        EventViewQuery: await getPreloadedQuery(
          EidEventViewQueryGenerated,
          {
            id: ctx.params.eid,
          },
          ctx,
        ),
      },
      ...(await serverSideTranslations(ctx.locale, ['en', 'ptBR'])),
    },
  };
}
