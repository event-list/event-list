import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getPreloadedQuery } from '@event-list/relay';

import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import RootLayout from '../../components/RootLayout';
import { ProfileView } from '../../components/user/ProfileView';

export default function Profile(props) {
  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
      <ProfileView preloadedQuery={props.queryRefs.ProfileViewQuery} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileViewQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
      },
      ...(await serverSideTranslations(ctx.locale, ['en', 'ptBR'])),
    },
  };
}
