import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { graphql, useFragment, usePreloadedQuery } from 'react-relay';

import { FEATURES } from '@event-list/flags';

import type { eventsViewQuery } from '../../../__generated__/eventsViewQuery.graphql';
import EventsViewGenerated from '../../../__generated__/eventsViewQuery.graphql';
import type { ProfileViewQuery as ProfileViewQueryPreloaded } from '../../../__generated__/ProfileViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import type { useAdminAuthFragment_user$key } from '../../../__generated__/useAdminAuthFragment_user.graphql';
import { useAdminAuthFragment } from '../../auth/useAdminAuth';
import EventsList from '../../components/event/EventsList';
import { BetaView } from '../../components/features/BetaView';
import { ProfileViewQuery } from '../../components/merchant/ProfileView';
import RootLayout from '../../components/RootLayout';
import getPreloadedQuery from '../../relay/getPreloadedQuery';

const EventsView = graphql`
  query eventsViewQuery {
    ...EventsListFragment_query
  }
`;

export default function Page(props) {
  const key = usePreloadedQuery<eventsViewQuery>(EventsView, props.queryRefs.EventsViewQuery);

  const { meAdmin } = usePreloadedQuery<ProfileViewQueryPreloaded>(ProfileViewQuery, props.queryRefs.ProfileQuery);

  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  if (!merchant?.features?.includes(FEATURES.BETA)) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
        <BetaView />
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery}>
      <EventsList fragmentKey={key} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['ptBR', 'en'])),
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        EventsViewQuery: await getPreloadedQuery(EventsViewGenerated, {}, ctx),
      },
    },
  };
}
