import type { IconProps } from '@chakra-ui/react';
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HiUser } from 'react-icons/hi';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import { Button, InputAvatar, InputField, TextDecorated } from '@event-list/ui';

import { SignUp } from './SignUpMutation';
import type { SignUpMutation, SignUpMutation$data } from '../../../__generated__/SignUpMutation.graphql';
import Logo from '../../../data/logo.svg';

type SignUpParams = yup.InferType<typeof SignUpSchema>;

const SignUpSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  name: yup.string().required('Name is required').min(2, 'Name should be 2 chars minimum.'),
  description: yup.string().required('Description is required').min(5, 'Name should be 5 chars minimum.'),
  logo: yup.string().required('Logo is required'),
  password: yup.string().required('Password is required').min(8, 'Password should be 8 chars minimum.'),
  phoneNumber: yup.string().required('Phone Number is required'),
});

export default function SignUpView() {
  const { t } = useTranslation(['ptBR', 'en']);

  const router = useRouter();
  const toast = useToast();

  const [MerchantSignUp, isPending] = useMutation<SignUpMutation>(SignUp);

  const onSubmit = (values: SignUpParams) => {
    const config = {
      variables: {
        input: {
          email: values.email,
          name: values.name,
          description: values.description,
          logo: values.logo,
          password: values.password,
          // cnpj: {
          //   taxID: formatToCNPJ(values.cnpj),
          //   type: 'BR:CNPJ',
          // },
          phoneNumber: values.phoneNumber,
        },
      },

      onCompleted: ({ MerchantSignUpMutation }: SignUpMutation$data) => {
        if (typeof MerchantSignUpMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (MerchantSignUpMutation?.error) {
          toast({
            title: MerchantSignUpMutation.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: MerchantSignUpMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.push('/');
      },
    };

    MerchantSignUp(config);
  };

  const formik = useFormik<SignUpParams>({
    initialValues: {
      email: '',
      name: '',
      description: '',
      logo: '',
      password: '',
      phoneNumber: '',
    },
    validationSchema: SignUpSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <Box
        position={'relative'}
        minH={'100vh'}
        bgImage={"linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url('/login-register-banner.jpg')"}
        bgPosition="center"
        bgSize={'cover'}
        bgRepeat="no-repeat"
        bgAttachment={'fixed'}
      >
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Stack direction={'row'} spacing={4} align={'center'}>
              <Logo height="150px" />
            </Stack>
            <Box pl="1rem">
              <Heading lineHeight={1.1} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                <TextDecorated>{t('Share')}</TextDecorated> {t('your best events')}{' '}
                <TextDecorated>{t('here!')}</TextDecorated>
              </Heading>
            </Box>
          </Stack>
          <Flex
            bg={'gray.50'}
            rounded={'xl'}
            p={{ base: 4, sm: 6, md: 8 }}
            maxW={{ lg: 'lg' }}
            flexDirection="column"
            justifyContent="center"
          >
            <Stack spacing={{ base: 8 }}>
              <Stack spacing={4}>
                <Heading color={'gray.700'} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                  {t('Sign up your merchant account')}{' '}
                  <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                    !
                  </Text>
                </Heading>
              </Stack>
              <Box as={'form'} mt={10}>
                <Stack spacing={4}>
                  <InputField
                    labelProps={{ color: 'gray.700' }}
                    name="email"
                    label={t('Email')}
                    placeholder="user@email.com"
                    _placeholder={{
                      color: 'gray.400',
                    }}
                    color={'gray.700'}
                    bg={'gray.100'}
                    border={0}
                  />
                  <InputField
                    labelProps={{ color: 'gray.700' }}
                    type="password"
                    name="password"
                    label={t('Password')}
                    placeholder="********"
                    _placeholder={{
                      color: 'gray.400',
                    }}
                    color={'gray.700'}
                    bg={'gray.100'}
                    border={0}
                  />
                  <HStack>
                    <InputField
                      labelProps={{ color: 'gray.700' }}
                      bg={'gray.100'}
                      label={t('Merchant name')}
                      border={0}
                      color={'gray.700'}
                      name="name"
                      placeholder={t('Your merchant name')}
                      _placeholder={{
                        color: 'gray.400',
                      }}
                    />
                    <InputField
                      labelProps={{ color: 'gray.700' }}
                      name="phoneNumber"
                      label={t('Phone number')}
                      placeholder="+5548999999999"
                      _placeholder={{
                        color: 'gray.400',
                      }}
                      color={'gray.700'}
                      bg={'gray.100'}
                      border={0}
                    />
                  </HStack>
                  <InputField
                    labelProps={{ color: 'gray.700' }}
                    name="description"
                    label={t('Description')}
                    placeholder={t('What about is your label?')}
                    _placeholder={{
                      color: 'gray.400',
                    }}
                    color={'gray.700'}
                    bg={'gray.100'}
                    border={0}
                  />
                  <InputAvatar name="logo" label={t('Logo')} icon={<HiUser size={'4rem'} />} />
                </Stack>
                <Button
                  size="lg"
                  text={t('Register')}
                  mt={8}
                  w={'full'}
                  isSubmitting={isPending}
                  isDisabled={isDisabled}
                  onClick={() => handleSubmit()}
                />
              </Box>
            </Stack>
            <Center pt={'3'}>
              <Link color={'gray.700'} href={'/sign-in'} fontSize={{ base: 'sm', lg: 'md' }}>
                {t('Already have an account? Sign In')}
              </Link>
            </Center>
          </Flex>
        </Container>
        <Blur
          position={'absolute'}
          top={useBreakpointValue({ base: 300, md: 100, lg: -10 })}
          left={useBreakpointValue({ base: 70, md: 30, lg: -10 })}
          style={{ filter: 'blur(70px)' }}
        />
      </Box>
    </FormikProvider>
  );
}

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '80vw', md: '40vw', lg: '30vw' })}
      zIndex="-1"
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ed5136" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ec4b4b" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#bb4883" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#e1428c" />
    </Icon>
  );
};
