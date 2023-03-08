import { Text } from '@chakra-ui/react';
import { useFragment } from 'react-relay';

import { Card } from '@event-list/ui';

import type { MerchantViewFragment_merchant$key } from '../../../__generated__/MerchantViewFragment_merchant.graphql';
import { MerchantViewFragment } from './MerchantView';

const MerchantCard = (props: { fragmentKey: MerchantViewFragment_merchant$key }) => {
  const label = useFragment<MerchantViewFragment_merchant$key>(MerchantViewFragment, props.fragmentKey);

  if (!label) return null;

  return (
    <Card linkNavigation={`/label/${label.id}`} urlImage={label.logo ?? ''} title={label.name}>
      <Text>{label.description}</Text>
    </Card>
  );
};

export { MerchantCard };
