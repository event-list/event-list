import { CircularProgress, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { graphql, usePaginationFragment } from 'react-relay';

import { ContainerPage } from '@event-list/ui';

import { MerchantCard } from './MerchantCard';
import type { MerchantListFragment_query$key } from '../../../__generated__/MerchantListFragment_query.graphql';
import type { MerchantListPagination_query } from '../../../__generated__/MerchantListPagination_query.graphql';

const MerchantListFragment = graphql`
  fragment MerchantListFragment_query on Query
  @argumentDefinitions(first: { type: Int, defaultValue: 12 }, after: { type: String })
  @refetchable(queryName: "MerchantListPagination_query") {
    merchants(first: $first, after: $after) @connection(key: "MerchantList_merchants", filters: []) {
      edges {
        node {
          ...MerchantViewFragment_merchant
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

const MerchantList = (props: { fragmentKey: MerchantListFragment_query$key }) => {
  const { t } = useTranslation(['en', 'ptBR']);

  const { data, loadNext, isLoadingNext } = usePaginationFragment<
    MerchantListPagination_query,
    MerchantListFragment_query$key
  >(MerchantListFragment, props.fragmentKey);

  const merchants = data.merchants;

  if (!merchants.edges) {
    return (
      <SimpleGrid minChildWidth="350px" spacing="20px">
        <Text>{t('Merchants not found')}</Text>
      </SimpleGrid>
    );
  }

  const loadMore = () => {
    if (isLoadingNext) {
      return;
    }
    loadNext(4);
  };

  const infiniteScrollerLoader = (
    <Flex flex={1} alignItems={'center'} justifyContent={'center'}>
      <CircularProgress color={'#E53E3E'} />
    </Flex>
  );

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={merchants.pageInfo.hasNextPage}
      loader={infiniteScrollerLoader}
      useWindow
    >
      <ContainerPage title={t('Merchants')} description={t('Find your favorite event creators')!}>
        <SimpleGrid
          minChildWidth="350px"
          templateColumns={{
            base: 'repeat(1, 1fr)',
            lg: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
          spacing="20px"
        >
          {merchants.edges.map((merchant, index) => {
            if (merchant?.node) return <MerchantCard key={index} fragmentKey={merchant?.node} />;
          })}
        </SimpleGrid>
      </ContainerPage>
    </InfiniteScroll>
  );
};

export { MerchantList };
