import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import ShareEventForm from '../../components/event/create/ShareEventForm';
import RootLayout from '../../components/RootLayout';
import getPreloadedQuery from '../../relay/getPreloadedQuery';

export default function Page(props) {
  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileQuery} title="Share your Event">
      <ShareEventForm />
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
