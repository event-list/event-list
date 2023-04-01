import type { IconProps } from '@chakra-ui/react';
import {
  Box,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Link,
  Radio,
  RadioGroup,
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

import { SignUp } from './SignUpMutation';
import type { SignUpMutation, SignUpMutation$data } from '../../../__generated__/SignUpMutation.graphql';
import Logo from '../../../data/logo.svg';

type SignUpParams = yup.InferType<typeof SignUpSchema>;

const SignUpSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  name: yup.string().required('Full Name is required'),
  gender: yup.string().required('Gender is required'),
});

export default function SignUpView() {
  const [UserSignUn, isPending] = useMutation<SignUpMutation>(SignUp);

  const toast = useToast();

  const router = useRouter();

  const onSubmit = (values: SignUpParams) => {
    const config = {
      variables: {
        input: {
          email: values.email,
          password: values.password,
          gender: values.gender,
          name: values.name,
        },
      },

      onCompleted: ({ UserSignUpMutation }: SignUpMutation$data) => {
        if (typeof UserSignUpMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
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
      gender: 'mas',
      name: '',
    },
    validationSchema: SignUpSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <Box position={'relative'} h={'100vh'}>
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
                Ensure your <TextDecorated>presence</TextDecorated> in the bests <TextDecorated>events!</TextDecorated>
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
                  Sign up your account{' '}
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
                      label="Email:"
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
                  </FormControl>
                  <HStack>
                    <FormControl id="name" isRequired>
                      <InputField
                        labelProps={{ color: 'gray.700' }}
                        bg={'gray.100'}
                        label={'Full Name:'}
                        border={0}
                        color={'gray.700'}
                        name="name"
                        placeholder="Your full name"
                        _placeholder={{
                          color: 'gray.400',
                        }}
                      />
                    </FormControl>
                    <FormControl id="gender" isRequired>
                      <FormLabel color={'gray.700'}>Gender:</FormLabel>
                      <RadioGroup
                        onChange={(data) => {
                          setFieldValue('gender', data);
                        }}
                        value={values.gender}
                        color={'gray.700'}
                        mt="0.5rem"
                      >
                        <Stack direction="row">
                          <Radio value="mas" colorScheme="red" borderColor="gray.400">
                            Male
                          </Radio>
                          <Radio value="fem" colorScheme="red" borderColor="gray.400">
                            Female
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </HStack>
                </Stack>
                <Button
                  size="lg"
                  text="Register"
                  mt={8}
                  w={'full'}
                  isSubmitting={isPending}
                  disabled={isDisabled}
                  onClick={() => handleSubmit()}
                />
              </Box>
            </Stack>
            <Center pt={'3'}>
              <Link color={'gray.700'} href={'/sign-in'} fontSize={{ base: 'smaller', lg: 'md' }}>
                Already have an account? Sign In
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
