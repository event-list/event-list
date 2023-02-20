import { getPreloadedQuery } from '@event-list/relay';

import ProfileQueryGenerated from '../../../__generated__/ProfileQuery.graphql';
import RootLayout from '../../components/RootLayout';
import { ProfileView } from '../../components/user/Profile';

export default function Profile(props) {
  return (
    <RootLayout preloadedQuery={props.ProfileQuery}>
      <ProfileView preloadedQuery={props.ProfileQuery} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      ProfileQuery: await getPreloadedQuery(ProfileQueryGenerated, {}, ctx),
    },
  };
}
