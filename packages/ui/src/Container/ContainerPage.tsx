import { Stack, Text } from '@chakra-ui/react';

import { TextDecorated } from '@event-list/ui';

const ContainerPage = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <Stack spacing={8} px={'2rem'}>
      <Stack>
        <TextDecorated fontSize={'5xl'} fontWeight={'bold'}>
          {title}
        </TextDecorated>
        {description && <Text color={'gray.200'}>{description}</Text>}
      </Stack>
      {children}
    </Stack>
  );
};

export default ContainerPage;
