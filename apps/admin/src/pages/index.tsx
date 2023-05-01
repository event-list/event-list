import { useFragment, usePreloadedQuery } from 'react-relay';

import { FEATURES } from '@event-list/flags';

import type { ProfileViewQuery as ProfileViewQueryPreloaded } from '../../__generated__/ProfileViewQuery.graphql';
import ProfileViewQueryGenerated from '../../__generated__/ProfileViewQuery.graphql';
import type { useAdminAuthFragment_user$key } from '../../__generated__/useAdminAuthFragment_user.graphql';
import { useAdminAuthFragment } from '../auth/useAdminAuth';
import { BetaView } from '../components/features/BetaView';
import { ProfileViewQuery } from '../components/merchant/ProfileView';
import RootLayout from '../components/RootLayout';
import { WelcomeView } from '../components/welcome/WelcomeView';
import getPreloadedQuery from '../relay/getPreloadedQuery';

export default function Page(props) {
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
      <WelcomeView />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
      },
    },
  };
}
