import RootLayoutGenerated from '../../../__generated__/RootLayoutQuery.graphql';
import ShareEventView from '../../components/event/share/ShareEventView';
import RootLayout from '../../components/RootLayout';
import getPreloadedQuery from '../../relay/getPreloadedQuery';

export default function Page(props) {
  return (
    <RootLayout preloadedQuery={props.queryRefs.RootLayout} title="Share your Event">
      <ShareEventView />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        RootLayout: await getPreloadedQuery(RootLayoutGenerated, {}, ctx),
      },
    },
  };
}
