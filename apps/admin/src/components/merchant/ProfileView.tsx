import {
  Avatar,
  Box,
  Center,
  Flex,
  FormControl,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { HiUser } from 'react-icons/hi';
import type { PreloadedQuery } from 'react-relay';
import { useFragment, useMutation, usePreloadedQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import * as yup from 'yup';

import { Button, InputArea, InputField, InputFile } from '@event-list/ui';

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
  const { uploadToS3 } = useS3Upload();
  const toast = useToast();

  const [HandleMerchantMeUpdate, isPending] = useMutation<MerchantMeUpdateMutation>(MerchantMeUpdate);

  const { meAdmin } = usePreloadedQuery<ProfileViewQueryType>(ProfileViewQuery, props.preloadedQuery);

  const merchant = useFragment<useAdminAuthFragment_user$key>(useAdminAuthFragment, meAdmin);

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    if (file.size > 1048576) {
      alert('File is too big! 1MB Max');
    }

    const { url } = await uploadToS3(file);

    await setFieldValue('logo', url);
  };

  const color = useColorModeValue('white', 'gray.800');

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
            title: 'Something was wrong',
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
          No merchant found
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

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

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
          <HStack>
            <Avatar
              size={'2xl'}
              icon={<HiUser size={'4rem'} />}
              src={values.logo}
              color={'gray.700'}
              bg={color}
              border="4px solid"
              borderColor="gray.800"
              cursor={'pointer'}
              onClick={() => document.getElementById('logo-input')?.click()}
            />
            <FormControl id="logo" isRequired>
              <InputFile id={'logo-input'} name="logo" display={'none'} onChange={handleFileChange} />
            </FormControl>
          </HStack>
          <Text>{merchant.email}</Text>
        </Flex>
        <FormikProvider value={formik}>
          <Stack spacing={5}>
            <HStack>
              <FormControl id="name" isRequired>
                <InputField
                  name="name"
                  label="Merchant Name:"
                  placeholder="Merchant Name"
                  defaultValue={merchant.name}
                />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <InputField
                  name="phoneNumber"
                  label="Phone Number:"
                  placeholder="+5548999999999"
                  defaultValue={merchant.phoneNumber}
                />
              </FormControl>
            </HStack>
            <FormControl id="description" isRequired>
              <InputField
                name="description"
                label="Description:"
                placeholder="What about is your Merchant"
                defaultValue={merchant.phoneNumber}
              />
            </FormControl>
            <FormControl id="biography" isRequired>
              <InputArea
                name="biography"
                label="Biography:"
                placeholder="A short description for your company"
                defaultValue={merchant.biography ?? ''}
              />
            </FormControl>
            <HStack>
              <FormControl id="instagramAccount" isRequired>
                <InputField
                  name="instagramAccount"
                  label="Instagram Username:"
                  placeholder="Your instagram username"
                  defaultValue={merchant.instagramAccount ?? ''}
                />
              </FormControl>
              <FormControl id="facebookAccount" isRequired>
                <InputField
                  name="facebookAccount"
                  label="Facebook Username:"
                  placeholder="Your facebook username"
                  defaultValue={merchant.facebookAccount ?? ''}
                />
              </FormControl>
              <FormControl id="twitterAccount" isRequired>
                <InputField
                  name="twitterAccount"
                  label="Twitter Username:"
                  placeholder="Your twitter username"
                  defaultValue={merchant.twitterAccount ?? ''}
                />
              </FormControl>
            </HStack>
            <FormControl id="website" isRequired>
              <InputField
                name="website"
                label="Website:"
                placeholder="https://yourwebsite.com"
                defaultValue={merchant.website ?? ''}
              />
            </FormControl>
            <Button
              size="lg"
              text="Update informations"
              w={'full'}
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
