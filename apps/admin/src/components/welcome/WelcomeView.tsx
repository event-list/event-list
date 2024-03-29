import { HStack, Stack } from '@chakra-ui/react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { Hero, Container } from '@event-list/ui';

import HelpImage from '../../../data/images/HelpImage.webp';
import MyEventsImage from '../../../data/images/MyEventsImage.webp';
import ProfileImage from '../../../data/images/ProfileImage.webp';
import ShareEventImage from '../../../data/images/ShareEventImage.webp';

const WelcomeView = () => {
  const { t } = useTranslation(['ptBR', 'en']);

  return (
    <Hero title={t('Welcome')} description={t('Event List is a new way to share your events, enjoy it!')}>
      <Stack spacing={6}>
        <Container
          title={t('Share your event')}
          description={t('Do not waste time and share your events now')}
          buttonNav={{
            href: '/share-your-event',
            label: t('Share an event')!,
          }}
          image={<Image src={ShareEventImage} layout="fill" objectFit="contain" />}
        />
        <HStack spacing={6} display={{ base: 'none', xl: 'flex' }}>
          <Container
            title={t('See your events')}
            description={t('Total people confirmed, guest list, price, and more...')}
            buttonNav={{
              href: '/events',
              label: t('My events')!,
            }}
            image={<Image src={MyEventsImage} layout="fill" objectFit="contain" />}
            h="full"
          />
          <Container
            title={t('Edit your profile')}
            description={t('Logo, instagram, website, description, and more...')}
            buttonNav={{
              href: '/profile',
              label: t('Profile')!,
            }}
            image={<Image src={ProfileImage} layout="fill" objectFit="contain" />}
            h="full"
          />
        </HStack>
        <Container
          title={t('See your events')}
          description={t('Total people confirmed, guest list, price, and more...')}
          buttonNav={{
            href: '/events',
            label: t('My events')!,
          }}
          image={<Image src={MyEventsImage} layout="fill" objectFit="contain" />}
          display={{ base: 'relative', xl: 'none' }}
        />
        <Container
          title={t('Edit your profile')}
          description={t('Logo, instagram, website, description, and more...')}
          buttonNav={{
            href: '/profile',
            label: t('Profile')!,
          }}
          image={<Image src={ProfileImage} layout="fill" objectFit="contain" />}
          display={{ base: 'relative', xl: 'none' }}
        />
        <Container
          title={t('New here?')}
          description={t('Start with our help page')}
          buttonNav={{ href: '/help', label: t('Help')! }}
          image={<Image src={HelpImage} layout="fill" objectFit="contain" />}
        />
      </Stack>
    </Hero>
  );
};

export { WelcomeView };
