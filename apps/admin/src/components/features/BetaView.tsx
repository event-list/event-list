import { Flex } from '@chakra-ui/react';

import { TextDecorated } from '@event-list/ui';

const BetaView = () => {
  return (
    <Flex justifyContent={'center'} alignItems={'center'}>
      <TextDecorated fontSize={'2xl'} fontWeight={'bold'}>
        Thank you for participating in the Beta, wait for your login to be approved so you can enjoy the benefits!
      </TextDecorated>
    </Flex>
  );
};

export { BetaView };
