import { Box, Center, Flex, FormControl, Heading, HStack, Stack, Text, useToast } from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { HiUser } from 'react-icons/hi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, useMutation, usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import * as yup from 'yup';

import { Button, InputArea, InputAvatar, InputField } from '@event-list/ui';


import { MerchantMeUpdate } from './mutations/MerchantMeUpdateMutation';
import type {
  MerchantMeUpdateMutation,
  MerchantMeUpdateMutation$data,
} from '../../../__generated__/MerchantMeUpdateMutation.graphql';
import type { ProfileViewQuery as ProfileViewQueryType } from '../../../__generated__/ProfileViewQuery.graphql';
import type { useAdminAuthFragment_user$key } from '../../../__generated__/useAdminAuthFragment_user.graphql';
import { useAdminAuthFragment } from '../../auth/useAdminAuth';

export const ProfileViewQuery = graphql`
  query ProfileViewQuery {
    meAdmin {
      ...useAdminAuthFragment_user
    }
  }
`;

type ProfileViewProps = {
  preloadedQuery: PreloadedQuery<ProfileViewQueryType>;
};

type MerchantMeUpdateParams = yup.InferType<typeof MerchantMeUpdateSchema>;

const MerchantMeUpdateSchema = yup.object({
  name: yup.string().required('Merchant Name is required'),
  biography: yup.string(),
  description: yup.string().required('Description is required'),
  logo: yup.string(),
  phoneNumber: yup.string().required('Phone number is required'),
  instagramAccount: yup.string(),
  facebookAccount: yup.string(),
  twitterAccount: yup.string(),
  website: yup.string().url('Invalid URL'),
});

const ProfileView = (props: ProfileViewProps) => {
  const { t } = useTranslation(['ptBR', 'en']);

  const toast = useToast();

  const [HandleMerchantMeUpdate, isPending] = useMutation<MerchantMeUpdateMutation>(MerchantMeUpdate);

  const { meAdmin } = usePreloadedQuery<ProfileViewQueryType>(ProfileViewQuery, props.preloadedQuery);

  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  const onSubmit = (values: MerchantMeUpdateParams) => {
    const config = {
      variables: {
        input: {
          name: values.name,
          biography: values.biography,
          description: values.description,
          logo: values.logo,
          phoneNumber: values.phoneNumber,
          instagramAccount: values.instagramAccount,
          facebookAccount: values.facebookAccount,
          twitterAccount: values.twitterAccount,
          website: values.website,
        },
      },

      onCompleted: ({ MerchantMeUpdateMutation }: MerchantMeUpdateMutation$data) => {
        if (typeof MerchantMeUpdateMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (MerchantMeUpdateMutation?.error) {
          toast({
            title: MerchantMeUpdateMutation.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: MerchantMeUpdateMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      },
    };

    HandleMerchantMeUpdate(config);
  };

  if (!merchant) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          {t('No merchant found')}
        </Heading>
      </Box>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formik = useFormik<MerchantMeUpdateParams>({
    initialValues: {
      name: merchant.name,
      biography: merchant.biography ?? '',
      description: merchant.description,
      logo: merchant.logo,
      phoneNumber: merchant.phoneNumber,
      instagramAccount: merchant.instagramAccount ?? '',
      facebookAccount: merchant.facebookAccount ?? '',
      twitterAccount: merchant.twitterAccount ?? '',
      website: merchant.website ?? '',
    },
    validationSchema: MerchantMeUpdateSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
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
            <HStack>
              <InputAvatar name="logo" icon={<HiUser size={'4rem'} />} />
            </HStack>
            <Text>{merchant.email}</Text>
          </Flex>
          <Stack spacing={5}>
            <HStack>
              <InputField
                name="name"
                label={t('Merchant name')}
                placeholder={t('Your merchant name')}
                defaultValue={merchant.name}
              />
              <InputField
                name="phoneNumber"
                label={t('Phone number')}
                placeholder="+5548999999999"
                defaultValue={merchant.phoneNumber}
              />
            </HStack>
            <InputField
              name="description"
              label={t('Description')!}
              placeholder={t('What about is your merchant')}
              defaultValue={merchant.phoneNumber}
            />
            <InputArea
              name="biography"
              label={t('Biography me')}
              placeholder={t('A short description for your company')}
              defaultValue={merchant.biography ?? ''}
            />
            <HStack>
              <InputField
                name="instagramAccount"
                label={t('Instagram username')}
                placeholder={t('Your instagram username')}
                defaultValue={merchant.instagramAccount ?? ''}
              />
              <InputField
                name="facebookAccount"
                label={t('Facebook username')}
                placeholder={t('Your facebook username')}
                defaultValue={merchant.facebookAccount ?? ''}
              />
              <InputField
                name="twitterAccount"
                label={t('Twitter username')}
                placeholder={t('Your twitter username')}
                defaultValue={merchant.twitterAccount ?? ''}
              />
            </HStack>
            <InputField
              name="website"
              label={t('Website')}
              placeholder={t('https://yourwebsite.com')}
              defaultValue={merchant.website ?? ''}
            />
            <Button
              size="lg"
              text={t('Update informations')}
              w={'full'}
              isSubmitting={isPending}
              isDisabled={isDisabled}
              onClick={() => handleSubmit()}
            />
          </Stack>
        </Flex>
      </Center>
    </FormikProvider>
  );
};

export { ProfileView };
