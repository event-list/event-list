import { Stack, Text } from '@chakra-ui/react';

import { TextDecorated } from '@event-list/ui';

type HeroProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Hero = ({ title, description, children }: HeroProps) => {
  return (
    <Stack spacing={8}>
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

export default Hero;
