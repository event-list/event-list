import { Text } from '@chakra-ui/react';
import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { LidLabelViewQuery } from '../../../__generated__/LidLabelViewQuery.graphql';
import LidLabelViewQueryGenerated from '../../../__generated__/LidLabelViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import { MerchantView } from '../../components/merchant/MerchantView';
import RootLayout from '../../components/RootLayout';

const LabelViewQuery = graphql`
  query LidLabelViewQuery($id: ID!) @preloadable {
    merchant: node(id: $id) {
      ...MerchantViewFragment_merchant
    }
  }
`;

export default function Page(props) {
  const { merchant } = usePreloadedQuery<LidLabelViewQuery>(LabelViewQuery, props.queryRefs.LabelViewQuery);

  if (!merchant) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
        <Text>Label not found</Text>
      </RootLayout>
    );
  }

  return (
    <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
      <MerchantView fragmentKey={merchant} />
    </RootLayout>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      preloadedQueries: {
        ProfileViewQuery: await getPreloadedQuery(ProfileViewQueryGenerated, {}, ctx),
        LabelViewQuery: await getPreloadedQuery(
          LidLabelViewQueryGenerated,
          {
            id: ctx.params.lid,
          },
          ctx,
        ),
      },
    },
  };
}
