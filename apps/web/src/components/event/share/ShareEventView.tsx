import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FormikProvider, useFormik } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation } from 'react-relay';
import * as yup from 'yup';
import { ShareEvent } from './ShareEventMutation';
import {
  ShareEventMutation,
  ShareEventMutation$data,
} from '../../../../__generated__/ShareEventMutation.graphql';
import {
  InputFile,
  InputArea,
  TextDecorated,
  InputField,
  InputMask,
  Button,
} from '@event-list/ui';

type ShareEventParams = {
  title: string;
  description: string;
  label: string;
  date: string;
  eventOpenAt: string;
  eventEndAt: string;
  listAvailableAt: string;
  classification: string;
  price: string;
};

const ShareEventSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Password is required'),
  label: yup.string().required('Label is required'),
  date: yup.string().required('Date is required'),
  eventOpenAt: yup.string().required('Event open at is required'),
  eventEndAt: yup.string().required('Event end at is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  price: yup.string().required('Price is required'),
});

export default function ShareEventView() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { uploadToS3 } = useS3Upload();

  const [EventShareEvent, isPending] =
    useMutation<ShareEventMutation>(ShareEvent);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const router = useRouter();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const { url } = await uploadToS3(file);

    setImageUrl(url);
  };

  const onSubmit = (values: ShareEventParams) => {
    const config = {
      variables: {
        input: {
          title: values.title,
          description: values.description,
          label: values.label,
          date: values.date,
          eventOpenAt: values.eventOpenAt,
          eventEndAt: values.eventEndAt,
          listAvailableAt: values.listAvailableAt,
          classification: values.classification,
          price: values.price,
          flyer: imageUrl,
        },
      },
      onCompleted: ({ CreateEventMutation }: ShareEventMutation$data) => {
        if (typeof CreateEventMutation === 'undefined') {
          enqueueSnackbar('Something was wrong');
          return;
        }

        if (CreateEventMutation?.error) {
          enqueueSnackbar(CreateEventMutation.error);
          return;
        }

        enqueueSnackbar(CreateEventMutation?.success);

        router.push('/');
        closeSnackbar();
      },
    };

    EventShareEvent(config);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      label: '',
      date: '',
      eventOpenAt: '',
      eventEndAt: '',
      listAvailableAt: '',
      classification: '',
      price: '',
      flyer: '',
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid } = formik;

  const isDisabled = !isValid || isPending;

  return (
    <FormikProvider value={formik}>
      <Flex
        rounded={'xl'}
        p={{ base: 4, sm: 6, md: 8 }}
        justifyContent="center"
      >
        <Stack spacing={8} mx={'auto'} maxW={'6xl'} px={6}>
          <Stack align={'center'}>
            <TextDecorated
              fontSize={'6xl'}
              fontWeight={'bold'}
              textAlign={'center'}
            >
              Share your Event
            </TextDecorated>
            <Text fontSize={'lg'} color={'gray.500'}>
              to propagate your cool events ✌️
            </Text>
          </Stack>
          <Box as={'form'} rounded={'lg'}>
            <Stack spacing={4}>
              <HStack>
                <Box w="full">
                  <FormControl id="title" isRequired>
                    <InputField
                      name="title"
                      label="Title:"
                      placeholder="Event name"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="label" isRequired>
                    <InputField
                      name="label"
                      label="Label:"
                      placeholder="Organizer label"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="price" isRequired>
                    <InputField
                      name="price"
                      label="Price:"
                      placeholder="00,00"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="date" isRequired>
                    <InputMask
                      type="text"
                      labelProps={{ fontSize: 'xl' }}
                      label="Date:"
                      name="date"
                      placeholder="YYYY/MM/DD"
                      mask={[
                        /[2]/,
                        /[0]/,
                        /[2-3]/,
                        /[2-9]/,
                        '-',
                        /[0-1]/,
                        /[0-9]/,
                        '-',
                        /[0-3]/,
                        /[0-9]/,
                      ]}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="eventOpenAt" isRequired>
                    <InputMask
                      type="text"
                      labelProps={{ fontSize: 'xl' }}
                      name="eventOpenAt"
                      label="Event Open At:"
                      placeholder="20:00"
                      mask={[/[0-2]/, /[0-4]/, ':', /[0-5]/, /[0-9]/]}
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="eventEndAt" isRequired>
                    <InputMask
                      type="text"
                      name="eventEndAt"
                      label="Event End At:"
                      placeholder="04:00"
                      mask={[/[0-2]/, /[0-4]/, ':', /[0-5]/, /[0-9]/]}
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <HStack>
                <Box w="full">
                  <FormControl id="listAvailableAt" isRequired>
                    <InputMask
                      type="text"
                      name="listAvailableAt"
                      label="List Available At:"
                      placeholder="23:00"
                      mask={[/[0-2]/, /[0-4]/, ':', /[0-5]/, /[0-9]/]}
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
                <Box w="full">
                  <FormControl id="classification" isRequired>
                    <InputMask
                      type="text"
                      name="classification"
                      label="Classification:"
                      placeholder="18+"
                      mask="99"
                      labelProps={{ fontSize: 'xl' }}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="description" isRequired>
                <InputArea
                  name="description"
                  label="Description:"
                  placeholder="Describe your event"
                  labelProps={{ fontSize: 'xl' }}
                />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="flyer" isRequired>
                    <InputFile
                      name="flyer"
                      label="Flyer:"
                      labelProps={{ fontSize: 'xl' }}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                </Box>
                {imageUrl && (
                  <Box maxW="100px">
                    <Image
                      src={imageUrl}
                      alt="flyer-preview"
                      borderRadius="10px"
                    />
                  </Box>
                )}
              </HStack>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  type="submit"
                  onClick={() => handleSubmit()}
                  disabled={isDisabled}
                  text={'Send Event'}
                  isSubmitting={false}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </FormikProvider>
  );
}
