import { Text } from '@chakra-ui/react';
import { useFragment } from 'react-relay';

import { Card } from '@event-list/ui';

import type { MerchantViewFragment_merchant$key } from '../../../__generated__/MerchantViewFragment_merchant.graphql';
import { MerchantViewFragment } from './MerchantView';

const MerchantCard = (props: { fragmentKey: MerchantViewFragment_merchant$key }) => {
  const merchant = useFragment<MerchantViewFragment_merchant$key>(MerchantViewFragment, props.fragmentKey);

  if (!merchant) return null;

  return (
    <Card linkNavigation={`/merchant/${merchant.id}`} urlImage={merchant.logo ?? ''} title={merchant.name}>
      <Text>{merchant.description}</Text>
    </Card>
  );
};

export { MerchantCard };
