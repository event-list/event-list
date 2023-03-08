import { Stack } from '@chakra-ui/react';

import { TextDecorated } from '@event-list/ui';

const ContainerPage = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Stack spacing={8}>
      <Stack align={'center'}>
        <TextDecorated fontSize={'6xl'} fontWeight={'bold'} textAlign={'center'}>
          {title}
        </TextDecorated>
      </Stack>
      {children}
    </Stack>
  );
};

export default ContainerPage;
