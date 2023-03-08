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
  const label = useFragment<MerchantViewFragment_merchant$key>(MerchantViewFragment, props.fragmentKey);

  return (
    <Container maxW={'5xl'} py={12}>
      <Stack spacing={10} width={'100%'} direction={'column'}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Stack spacing={{ base: 8, md: 10 }}>
            <Stack spacing={2}>
              <Text fontSize={'sm'} color={'gray.500'}>
                {label.description}
              </Text>
              <Heading>
                {label.website ? (
                  <Link href={label.website} target={'_blank'}>
                    <TextDecorated>{label.name}</TextDecorated>
                  </Link>
                ) : (
                  <TextDecorated>{label.name}</TextDecorated>
                )}
              </Heading>
              <Flex display={{ base: 'flex', sm: 'none' }}>
                <Image rounded={'md'} w={'full'} alt={'merchant logo'} src={label.logo ?? ''} objectFit={'cover'} />
              </Flex>
            </Stack>
            {label.biography && <Text fontSize={'lg'}>{label.biography}</Text>}
            <Stack spacing={4} divider={<StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />}>
              <SocialMediaRow logo={BsWhatsapp} title={label.phoneNumber} href={`https://wa.me/${label.phoneNumber}`} />
              {label.instagramAccount && (
                <SocialMediaRow
                  logo={BsInstagram}
                  title={label.instagramAccount}
                  href={`https://instagram.com/${label.instagramAccount}`}
                />
              )}
              {label.facebookAccount && (
                <SocialMediaRow
                  logo={BsFacebook}
                  title={label.facebookAccount}
                  href={`https://facebook.com/${label.instagramAccount}`}
                />
              )}
              {label.twitterAccount && (
                <SocialMediaRow
                  logo={BsTwitter}
                  title={label.twitterAccount}
                  href={`https://twitter.com/${label.instagramAccount}`}
                />
              )}
            </Stack>
          </Stack>
          <Flex display={{ base: 'none', sm: 'flex' }}>
            <Image rounded={'md'} w={'full'} alt={'merchant logo'} src={label.logo ?? ''} objectFit={'cover'} />
          </Flex>
        </SimpleGrid>
        <Divider />
        <Box>
          <Stack spacing={8}>
            <Heading>
              <TextDecorated>Events</TextDecorated>
            </Heading>
            {label.events?.edges?.map((event, index) => {
              if (event?.node) return <EventRow key={index} fragmentKey={event?.node} />;
            })}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export { MerchantView };
