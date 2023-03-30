import { Box, FormControl, HStack, Image, Stack, useToast } from '@chakra-ui/react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useS3Upload } from 'next-s3-upload';
import { BsFillTrashFill } from 'react-icons/bs';
import { useMutation } from 'react-relay';
import * as yup from 'yup';

import {
  InputFile,
  InputArea,
  InputField,
  Button,
  InputMaps,
  InputDate,
  InputAge,
  InputPrice,
  ContainerPage,
  TextFormLabel,
} from '@event-list/ui';

import { ShareEvent } from './mutations/ShareEventMutation';
import type { ShareEventMutation, ShareEventMutation$data } from '../../../../__generated__/ShareEventMutation.graphql';

type ShareEventParams = yup.InferType<typeof ShareEventSchema>;

const ShareEventSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().min(12, 'Your description must have min 12 characters').required('Description is required'),
  place: yup.string().required('Place is required'),
  dateStart: yup.string().required('Date Start is required'),
  dateEnd: yup.string().required('Date End is required'),
  listAvailableAt: yup.string().required('List available at is required'),
  classification: yup.string().required('Classification is required'),
  batches: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required('Batch title is required'),
        value: yup.string().required('Batch value is required'),
        date: yup.string().required('Batch date is required'),
        visible: yup.boolean().notRequired(),
      }),
    )
    .required('Batches ate required')
    .max(6, 'Maximum of 6 batches'),
  flyer: yup.string().required('Flyer is required'),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ShareEventForm() {
  const { uploadToS3 } = useS3Upload();
  const router = useRouter();
  const toast = useToast();

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    const { url } = await uploadToS3(file);

    console.log(url);

    await setFieldValue('flyer', url);
  };

  const onSubmit = (values: ShareEventParams) => {
    const config = {
      variables: {
        input: {
          title: values.title,
          description: values.description,
          dateStart: values.dateStart,
          place: values.place,
          dateEnd: values.dateEnd,
          listAvailableAt: values.listAvailableAt,
          classification: values.classification,
          batches: values.batches,
          flyer: values.flyer,
        },
      },
      onCompleted: ({ CreateEventMutation }: ShareEventMutation$data) => {
        if (typeof CreateEventMutation === 'undefined') {
          toast({
            title: 'Something was wrong',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        if (CreateEventMutation?.error) {
          toast({
            title: CreateEventMutation?.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          return;
        }

        toast({
          title: CreateEventMutation?.success,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.push('/events');
      },
    };

    EventShareEvent(config);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dateStart: '',
      dateEnd: '',
      place: '',
      listAvailableAt: '',
      classification: '',
      batches: [
        {
          date: '',
          title: 'First batch',
          value: '',
          visible: true,
        },
      ],
      flyer: '',
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  return (
    <FormikProvider value={formik}>
      <ContainerPage title={'Share an Event'}>
        <Box as={'form'} rounded={'lg'}>
          <Stack spacing={8}>
            <HStack spacing={8}>
              <Box w="full">
                <FormControl id="title" isRequired>
                  <InputField name="title" label="Title:" placeholder="Event name" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="place" isRequired>
                  <InputMaps name="place" apiKey={googleMapsApiToken} label="Place:" placeholder="Event place" />
                </FormControl>
              </Box>
            </HStack>
            <HStack spacing={8}>
              <Box w="full">
                <FormControl id="dateStart" isRequired>
                  <InputDate label="Date Start:" name="dateStart" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="dateEnd" isRequired>
                  <InputDate label="Date End:" name="dateEnd" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="listAvailableAt" isRequired>
                  <InputDate name="listAvailableAt" label="List Available At:" />
                </FormControl>
              </Box>
              <Box w="full">
                <FormControl id="classification" isRequired>
                  <InputAge name="classification" label="Classification:" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="description" isRequired>
              <InputArea
                name="description"
                label="Description:"
                placeholder="Describe your event, the attractions, the place..."
              />
            </FormControl>
            <HStack>
              <Box w={'full'}>
                <FormControl id="flyer" isRequired>
                  <InputFile name="flyer" label="Flyer:" onChange={handleFileChange} />
                </FormControl>
              </Box>
              {values.flyer && (
                <Box maxW="100px">
                  <Image src={values.flyer} alt="flyer-preview" borderRadius="10px" />
                </Box>
              )}
              <FieldArray
                name="batches"
                render={(arrayHelpers) => (
                  <Stack w={'full'} spacing={8}>
                    {values.batches.map((batch, index) => (
                      <HStack spacing={5} key={index}>
                        <FormControl id={`batches.${index}.title`} isRequired>
                          <InputField name={`batches.${index}.title`} label="Batch Title:" />
                        </FormControl>
                        <FormControl id={`batches.${index}.value`} isRequired>
                          <InputPrice name={`batches.${index}.value`} label="Batch Price:" />
                        </FormControl>
                        <FormControl id={`batches.${index}.date`} isRequired>
                          <InputDate name={`batches.${index}.date`} label="Batch Date:" />
                        </FormControl>
                        <Box>
                          <TextFormLabel mt={'2'} fontSize={{ base: '13px', md: 'sm' }} label={'Actions'} />
                          <Button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            isDisabled={values.batches.length <= 1}
                            text={<BsFillTrashFill />}
                            isSubmitting={false}
                          />
                        </Box>
                      </HStack>
                    ))}
                    <Button
                      type="button"
                      isDisabled={values.batches.length > 5}
                      onClick={() =>
                        arrayHelpers.insert(values.batches.length + 1, {
                          date: '',
                          title: '',
                          value: '',
                        })
                      }
                      text={'New Batch'}
                      isSubmitting={false}
                    />
                  </Stack>
                )}
              />
            </HStack>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                onClick={() => handleSubmit()}
                disabled={isDisabled}
                text={'Share Event'}
                isSubmitting={isPending}
              />
            </Stack>
          </Stack>
        </Box>
      </ContainerPage>
    </FormikProvider>
  );
}
