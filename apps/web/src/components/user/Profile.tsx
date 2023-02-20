import { Avatar, Box, Center, Flex, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import { HiUser } from 'react-icons/hi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import type { ProfileQuery as ProfileQueryType } from '../../../__generated__/ProfileQuery.graphql';
import type { useAuthFragment_user$key } from '../../../__generated__/useAuthFragment_user.graphql';
import { useAuthFragment } from '../../auth/useAuth';

export const ProfileQuery = graphql`
  query ProfileQuery {
    me {
      ...useAuthFragment_user
    }
  }
`;

type ProfileViewProps = {
  preloadedQuery: PreloadedQuery<ProfileQueryType>;
};

const ProfileView = (props: ProfileViewProps) => {
  const { me } = usePreloadedQuery<ProfileQueryType>(ProfileQuery, props.preloadedQuery);

  const user = useFragment<useAuthFragment_user$key>(useAuthFragment, me);

  const color = useColorModeValue('white', 'gray.800');

  if (!user) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          No profile found
        </Heading>
      </Box>
    );
  }

  return (
    <Center py={6}>
      <Flex
        maxW={['100%', '100%', '40rem']}
        w={'full'}
        gap={'6'}
        p={'6'}
        direction={'column'}
        align="center"
        justify={'center'}
        bg={color}
        boxShadow={'2xl'}
        rounded={'lg'}
      >
        <Avatar
          size={'xl'}
          icon={<HiUser size={'4rem'} />}
          color={'gray.700'}
          bg={color}
          border="4px solid"
          borderColor="gray.800"
        />
        <Box>
          <Stack spacing={0} align={'center'}>
            <Heading fontSize={'2xl'} fontWeight={500}>
              {user.name}
            </Heading>
            <Text color={'gray.500'}>{user.email}</Text>
            <Text color={'gray.600'}>{user.gender}</Text>
          </Stack>
        </Box>
      </Flex>
    </Center>
  );
};

export { ProfileView };
