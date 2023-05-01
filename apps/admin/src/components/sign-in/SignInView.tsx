import type { IconProps } from '@chakra-ui/react';
import {
  Box,
  Center,
  Container,
  Flex,
  FormControl,
  Heading,
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
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import { Button, InputField, TextDecorated } from '@event-list/ui';

import { SignIn } from './SignInMutation';
import type { SignInMutation, SignInMutation$data } from '../../../__generated__/SignInMutation.graphql';
import Logo from '../../../data/logo.svg';

type SignInParams = yup.InferType<typeof SignInSchema>;

const SignInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function SignInView() {
  const [MerchantSignIn, isPending] = useMutation<SignInMutation>(SignIn);

  const toast = useToast();

  const router = useRouter();

  const onSubmit = (values: SignInParams) => {
    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
        },
      },

      onCompleted: ({ MerchantSignInMutation }: SignInMutation$data) => {
        if (typeof MerchantSignInMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (MerchantSignInMutation?.error) {
          toast({
            title: MerchantSignInMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: MerchantSignInMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.push('/');
      },
    };

    MerchantSignIn(config);
  };

  const formik = useFormik<SignInParams>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SignInSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty } = formik;

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
              <Image src={Logo} alt={'Small and red Event List logo'} />
            </Stack>
            <Box pl="1rem">
              <Heading lineHeight={1.1} fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                <TextDecorated>Share</TextDecorated> your best events <TextDecorated>here!</TextDecorated>
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
                  Sign in your merchant account{' '}
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
                    label="Email:"
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
                    label="Password:"
                    placeholder="*******"
                    _placeholder={{
                      color: 'gray.400',
                    }}
                    color={'gray.700'}
                    bg={'gray.100'}
                    border={0}
                  />
                </Stack>
                <Button
                  size="lg"
                  text="Login"
                  mt={8}
                  w={'full'}
                  isSubmitting={isPending}
                  isDisabled={isDisabled}
                  onClick={() => handleSubmit()}
                />
              </Box>
            </Stack>
            <Center pt={'3'}>
              <Link color={'gray.700'} href={'/sign-up'} fontSize={{ base: 'sm', lg: 'md' }}>
                Does not have an account? Sign Up
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
