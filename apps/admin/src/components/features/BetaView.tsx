import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

import { TextDecorated } from '@event-list/ui';


const BetaView = () => {
  const { t } = useTranslation(['ptBR', 'en']);

  return (
    <Flex justifyContent={'center'} alignItems={'center'}>
      <TextDecorated fontSize={'2xl'} fontWeight={'bold'}>
        {t(
          'Thank you for participating in the Beta, wait for your login to be approved so you can enjoy the benefits!',
        )}
      </TextDecorated>
    </Flex>
  );
};

export { BetaView };
