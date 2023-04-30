import {
  Avatar,
  Box,
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { HiUser } from 'react-icons/hi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, useMutation, usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import * as yup from 'yup';

import { Button, InputField } from '@event-list/ui';

import { UserMeUpdate } from './mutations/UserMeUpdateMutation';
import type { ProfileViewQuery as ProfileViewQueryType } from '../../../__generated__/ProfileViewQuery.graphql';
import type { useAuthFragment_user$key } from '../../../__generated__/useAuthFragment_user.graphql';
import type {
  UserMeUpdateMutation,
  UserMeUpdateMutation$data,
} from '../../../__generated__/UserMeUpdateMutation.graphql';
import { useAuthFragment } from '../../auth/useAuth';

export const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    me {
      ...useAuthFragment_user
    }
  }
`;

type ProfileViewProps = {
  preloadedQuery: PreloadedQuery<ProfileViewQueryType>;
};

type UserMeUpdateParams = yup.InferType<typeof UserMeUpdateSchema>;

const UserMeUpdateSchema = yup.object({
  name: yup.string(),
});

const ProfileView = (props: ProfileViewProps) => {
  const { t } = useTranslation(['en', 'ptBR']);

  const [HandleUserMeUpdate, isPending] = useMutation<UserMeUpdateMutation>(UserMeUpdate);

  const { me } = usePreloadedQuery<ProfileViewQueryType>(ProfileViewQuery, props.preloadedQuery);

  const user = useFragment<useAuthFragment_user$key>(useAuthFragment, me);

  const toast = useToast();

  const onSubmit = (values: UserMeUpdateParams) => {
    const config = {
      variables: {
        input: {
          name: values.name,
        },
      },

      onCompleted: ({ UserMeUpdateMutation }: UserMeUpdateMutation$data) => {
        if (typeof UserMeUpdateMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (UserMeUpdateMutation?.error) {
          toast({
            title: UserMeUpdateMutation.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: UserMeUpdateMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      },
    };

    HandleUserMeUpdate(config);
  };

  if (!user) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          {t('No user found')}
        </Heading>
      </Box>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formik = useFormik<UserMeUpdateParams>({
    initialValues: {
      name: user.name,
    },
    validationSchema: UserMeUpdateSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <Center py={6}>
      <Flex
        maxW={['100%', '100%', '55rem']}
        w={'full'}
        gap={'6'}
        py={'6'}
        px={3}
        direction={'column'}
        justify={'center'}
      >
        <Flex
          w={'full'}
          gap={3}
          direction={'column'}
          alignContent={'center'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Avatar
            size={'2xl'}
            icon={<HiUser size={'4rem'} />}
            color={'gray.700'}
            bg="gray.800"
            border="4px solid"
            borderColor="gray.800"
          />
          <Text>{user.email}</Text>
        </Flex>
        <FormikProvider value={formik}>
          <Stack spacing={5}>
            <HStack>
              <FormControl id="name" isRequired>
                <InputField name="name" label={t('Full name')!} placeholder={t('Full name')} defaultValue={user.name} />
              </FormControl>
            </HStack>
            <Button
              size="lg"
              text={t('Update informations')}
              w="full"
              isSubmitting={isPending}
              isDisabled={isDisabled}
              onClick={() => handleSubmit()}
            />
          </Stack>
        </FormikProvider>
      </Flex>
    </Center>
  );
};

export { ProfileView };
