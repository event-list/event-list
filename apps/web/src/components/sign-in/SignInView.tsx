'use client';

import {
  Box,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconProps,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-relay';
import * as yup from 'yup';
import { Logo } from '@event-list/assets/src/getLogo';
import { SignIn } from './SignInMutation';
import {
  SignInMutation,
  SignInMutation$data,
} from '../../../__generated__/SignInMutation.graphql';
import { Button, TextField } from '@event-list/ui';

type SignInParams = {
  email: string;
  password: string;
};

const SignInSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function SignInView() {
  const [UserSignIn, isPending] = useMutation<SignInMutation>(SignIn);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const onSubmit = (values: SignInParams) => {
    closeSnackbar();

    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
        },
      },

      onCompleted: ({ UserSignInMutation }: SignInMutation$data) => {
        if (typeof UserSignInMutation === 'undefined') {
          enqueueSnackbar('Something was wrong');
          return;
        }

        if (UserSignInMutation?.error) {
          enqueueSnackbar(UserSignInMutation.error);
          return;
        }

        enqueueSnackbar(UserSignInMutation?.success);

        router.push('/');
      },
    };

    UserSignIn(config);
  };

  const formik = useFormik<SignInParams>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SignInSchema,
    onSubmit,
  });

  const { handleSubmit, isValid } = formik;

  const isDisabled = !isValid || isPending;

  return (
    <FormikProvider value={formik}>
      <Box position={'relative'}>
        <Container
          as={SimpleGrid}
          maxW={'7xl'}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Stack direction={'row'} spacing={4} align={'center'}>
              <Logo />
            </Stack>
            <Box pl="1rem">
              <Heading
                lineHeight={1.1}
                fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
              >
                Ensure your presence in the best events{' '}
                <Text
                  as={'span'}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  &
                </Text>{' '}
                Share them
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
                <Heading
                  color={'gray.800'}
                  lineHeight={1.1}
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                >
                  Sign in your account{' '}
                  <Text
                    as={'span'}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text"
                  >
                    !
                  </Text>
                </Heading>
              </Stack>
              <Box as={'form'} mt={10}>
                <Stack spacing={4}>
                  <FormControl id="email" isRequired>
                    <TextField
                      name="email"
                      label="Email: "
                      placeholder="user@email.com"
                      _placeholder={{
                        color: 'gray.400',
                      }}
                      color={'gray.700'}
                      bg={'gray.100'}
                      border={0}
                    />
                  </FormControl>
                  <FormControl id="password" isRequired>
                    <TextField
                      type="password"
                      name="password"
                      label="Password: "
                      placeholder="*******"
                      _placeholder={{
                        color: 'gray.400',
                      }}
                      color={'gray.700'}
                      bg={'gray.100'}
                      border={0}
                    />
                  </FormControl>
                </Stack>
                <Button
                  size="lg"
                  text="Login"
                  mt={8}
                  w={'full'}
                  type="submit"
                  isSubmitting={isPending}
                  disabled={isDisabled}
                  onClick={() => handleSubmit()}
                />
              </Box>
            </Stack>
            <Center pt="2px">
              <Link
                color={'gray.700'}
                href={'/sign-up'}
                fontSize={{ base: 'sm', lg: 'md' }}
              >
                Does not have an account? Sign Up
              </Link>
            </Center>
          </Flex>
        </Container>
        <Blur
          position={'absolute'}
          top={-10}
          left={-10}
          style={{ filter: 'blur(70px)' }}
        />
      </Box>
    </FormikProvider>
  );
}

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
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
