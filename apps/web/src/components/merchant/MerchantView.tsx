import {
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  Icon,
  useColorModeValue,
  Image,
  Link,
  Box,
  Divider,
  Center,
} from '@chakra-ui/react';
import { BsFacebook, BsInstagram, BsTwitter, BsWhatsapp } from 'react-icons/bs';
import { graphql, useFragment } from 'react-relay';

import { TextDecorated } from '@event-list/ui';

import type { MerchantViewFragment_merchant$key } from '../../../__generated__/MerchantViewFragment_merchant.graphql';
import { EventRow } from '../event/EventRow';

export const MerchantViewFragment = graphql`
  fragment MerchantViewFragment_merchant on Merchant {
    id
    name
    events {
      edges {
        node {
          ...EventFragment_event
        }
      }
    }
    email
    description
    logo
    biography
    website
    phoneNumber
    twitterAccount
    instagramAccount
    facebookAccount
  }
`;

const SocialMediaRow = ({ logo, href, title }) => {
  if (!title) return null;
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex w={8} h={4} align={'center'} justify={'center'} rounded={'full'}>
        <Icon w={5} h={5} as={logo} />
      </Flex>
      <Text>
        <Link href={href} target={'_blank'}>
          {title}
        </Link>
      </Text>
    </Stack>
  );
};

const MerchantView = (props: { fragmentKey: MerchantViewFragment_merchant$key }) => {
  const merchant = useFragment<MerchantViewFragment_merchant$key>(MerchantViewFragment, props.fragmentKey);

  return (
    <Container maxW={'5xl'} py={12}>
      <Stack spacing={10} width={'100%'} direction={'column'}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={{ base: 8, md: 10 }}>
            <Stack spacing={2}>
              <Text fontSize={'sm'} color={'gray.500'}>
                {merchant.description}
              </Text>
              <Heading>
                {merchant.website ? (
                  <Link href={merchant.website} target={'_blank'}>
                    <TextDecorated>{merchant.name}</TextDecorated>
                  </Link>
                ) : (
                  <TextDecorated>{merchant.name}</TextDecorated>
                )}
              </Heading>
              <Flex display={{ base: 'flex', sm: 'none' }}>
                <Image rounded={'md'} w={'full'} alt={'merchant logo'} src={merchant.logo ?? ''} objectFit={'cover'} />
              </Flex>
            </Stack>
            {merchant.biography && <Text fontSize={'lg'}>{merchant.biography}</Text>}
            <Stack spacing={4} divider={<StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />}>
              <SocialMediaRow
                logo={BsWhatsapp}
                title={merchant.phoneNumber}
                href={`https://wa.me/${merchant.phoneNumber}`}
              />
              {merchant.instagramAccount && (
                <SocialMediaRow
                  logo={BsInstagram}
                  title={merchant.instagramAccount}
                  href={`https://instagram.com/${merchant.instagramAccount}`}
                />
              )}
              {merchant.facebookAccount && (
                <SocialMediaRow
                  logo={BsFacebook}
                  title={merchant.facebookAccount}
                  href={`https://facebook.com/${merchant.instagramAccount}`}
                />
              )}
              {merchant.twitterAccount && (
                <SocialMediaRow
                  logo={BsTwitter}
                  title={merchant.twitterAccount}
                  href={`https://twitter.com/${merchant.instagramAccount}`}
                />
              )}
            </Stack>
          </Stack>
          <Center display={{ base: 'none', sm: 'flex' }}>
            <Box rounded={'lg'} pos={'relative'}>
              <Image rounded={'lg'} height={{ base: 300, md: 500 }} objectFit={'cover'} src={merchant.logo ?? ''} />
            </Box>
          </Center>
        </SimpleGrid>
        <Divider />
        <Box>
          <Stack spacing={8}>
            <Heading>
              <TextDecorated>Events</TextDecorated>
            </Heading>
            {merchant.events?.edges?.map((event, index) => {
              if (event?.node) return <EventRow key={index} fragmentKey={event?.node} />;
            })}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export { MerchantView };
