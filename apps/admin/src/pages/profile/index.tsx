import { getPreloadedQuery } from '@event-list/relay';

import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import { ProfileView } from '../../components/merchant/ProfileView';
import RootLayout from '../../components/RootLayout';

export default function Page(props) {
  return (
    <RootLayout preloadedQuery={props.queryRefs.AdminProfileQuery}>
      <ProfileView preloadedQuery={props.queryRefs.AdminProfileQuery} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        AdminProfileQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
      },
    },
  };
}
