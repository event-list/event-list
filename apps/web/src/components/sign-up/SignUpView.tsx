import {
  Box,
  Center,
  Container,
  Flex,
  FormControl,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import { Button, InputField, TextDecorated } from '@event-list/ui';

import { SignUp } from './SignUpMutation';
import type { SignUpMutation, SignUpMutation$data } from '../../../__generated__/SignUpMutation.graphql';
import Logo from '../../../data/logo.svg';

type SignUpParams = yup.InferType<typeof SignUpSchema>;

const SignUpSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is Required'),
  password: yup.string().required('Password is required').min(8, 'Password should be 8 chars minimum.'),
  name: yup.string().required('Full Name is Required').min(2, 'Name should be 2 chars minimum.'),
});

export default function SignUpView() {
  const { t } = useTranslation(['en', 'ptBR']);
  const [UserSignUn, isPending] = useMutation<SignUpMutation>(SignUp);

  const toast = useToast();

  const router = useRouter();

  const onSubmit = (values: SignUpParams) => {
    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
          name: values.name,
        },
      },

      onCompleted: ({ UserSignUpMutation }: SignUpMutation$data) => {
        if (typeof UserSignUpMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (UserSignUpMutation?.error) {
          toast({
            title: UserSignUpMutation.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: UserSignUpMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.push('/');
      },
    };

    UserSignUn(config);
  };

  const formik = useFormik<SignUpParams>({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    validationSchema: SignUpSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <Box
        position={'relative'}
        h={'100vh'}
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
              <Image src={Logo} alt={'Small and red EventView List logo'} />
            </Stack>
            <Box pl="1rem">
              <Heading lineHeight={1.1} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                {t('Ensure your')} <TextDecorated>{t('Presence')} </TextDecorated>
                {t('In the bests')} <TextDecorated>{t('Events')}</TextDecorated>
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
                  {t('Sign up your account')}
                  <Text as={'span'} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
                    !
                  </Text>
                </Heading>
              </Stack>
              <Box as={'form'} mt={10}>
                <Stack spacing={4}>
                  <FormControl id="email" isRequired>
                    <InputField
                      labelProps={{ color: 'gray.700' }}
                      name="email"
                      label={t('Email')!}
                      placeholder={t('User@emailcom')!}
                      _placeholder={{
                        color: 'gray.400',
                      }}
                      color={'gray.700'}
                      bg={'gray.100'}
                      border={0}
                    />
                  </FormControl>
                  <FormControl id="password" isRequired>
                    <InputField
                      labelProps={{ color: 'gray.700' }}
                      type="password"
                      name="password"
                      label={t('Password')!}
                      placeholder="*******"
                      _placeholder={{
                        color: 'gray.400',
                      }}
                      color={'gray.700'}
                      bg={'gray.100'}
                      border={0}
                    />
                  </FormControl>
                  <HStack>
                    <FormControl id="name" isRequired>
                      <InputField
                        labelProps={{ color: 'gray.700' }}
                        bg={'gray.100'}
                        label={t('Full name')!}
                        border={0}
                        color="gray"
                        name="name"
                        placeholder={t('Your full name')!}
                        _placeholder={{
                          color: 'gray.400',
                        }}
                      />
                    </FormControl>
                  </HStack>
                </Stack>
                <Button
                  size="lg"
                  text={t('Register')!}
                  mt={8}
                  w="full"
                  isSubmitting={isPending}
                  isDisabled={isDisabled}
                  onClick={() => handleSubmit()}
                />
              </Box>
            </Stack>
            <Center pt={'3'}>
              <Link color={'gray.700'} href={'/sign-in'} fontSize={{ base: 'smaller', lg: 'md' }}>
                {t('Already have an account sign in')}
              </Link>
            </Center>
          </Flex>
        </Container>
      </Box>
    </FormikProvider>
  );
}
