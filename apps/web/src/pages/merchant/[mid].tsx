import { Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { graphql, usePreloadedQuery } from 'react-relay';

import { getPreloadedQuery } from '@event-list/relay';

import type { MidLabelViewQuery } from '../../../__generated__/MidLabelViewQuery.graphql';
import MidLabelViewQueryGenerated from '../../../__generated__/MidLabelViewQuery.graphql';
import ProfileViewQueryGenerated from '../../../__generated__/ProfileViewQuery.graphql';
import { MerchantView } from '../../components/merchant/MerchantView';
import RootLayout from '../../components/RootLayout';

const LabelViewQuery = graphql`
  query MidLabelViewQuery($id: ID!) @preloadable {
    merchant: node(id: $id) {
      ...MerchantViewFragment_merchant
    }
  }
`;

export default function Page(props) {
  const { t } = useTranslation(['en', 'ptBR']);

  const { merchant } = usePreloadedQuery<MidLabelViewQuery>(LabelViewQuery, props.queryRefs.LabelViewQuery);

  if (!merchant) {
    return (
      <RootLayout preloadedQuery={props.queryRefs.ProfileViewQuery}>
        <Text>{t('Label not found')}</Text>
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
          MidLabelViewQueryGenerated,
          {
            id: ctx.params.mid,
          },
          ctx,
        ),
      },
      ...(await serverSideTranslations(ctx.locale, ['en', 'ptBR'])),
    },
  };
}
