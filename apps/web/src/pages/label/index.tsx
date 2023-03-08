import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { labelLabelListQuery } from '../../../__generated__/labelLabelListQuery.graphql';
import LabelListQueryGenerated from '../../../__generated__/labelLabelListQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import { MerchantList } from '../../components/merchant/MerchantList';
import RootLayout from '../../components/RootLayout';

const LabelListQuery = graphql`
  query labelLabelListQuery {
    ...MerchantListFragment_query
  }
`;

export default function Label(props) {
  const data = usePreloadedQuery<labelLabelListQuery>(LabelListQuery, props.queryRefs.LabelListQuery);

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
      <MerchantList fragmentKey={data} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileViewQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        LabelListQuery: await getPreloadedQuery(LabelListQueryGenerated, {}, ctx),
      },
    },
  };
}
