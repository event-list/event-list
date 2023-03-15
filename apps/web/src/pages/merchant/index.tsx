import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { merchantMerchantListQuery } from '../../../__generated__/merchantMerchantListQuery.graphql';
import MerchantListQueryGenerated from '../../../__generated__/merchantMerchantListQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import { MerchantList } from '../../components/merchant/MerchantList';
import RootLayout from '../../components/RootLayout';

const MerchantListQuery = graphql`
  query merchantMerchantListQuery {
    ...MerchantListFragment_query
  }
`;

export default function Merchant(props) {
  const data = usePreloadedQuery<merchantMerchantListQuery>(MerchantListQuery, props.queryRefs.MerchantListQuery);

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
        MerchantListQuery: await getPreloadedQuery(MerchantListQueryGenerated, {}, ctx),
      },
    },
  };
}
