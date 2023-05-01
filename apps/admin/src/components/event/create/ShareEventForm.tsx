import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  FormControl,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
  Grid,
} from '@chakra-ui/react';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { BsFillTrashFill, BsPlusCircleFill } from 'react-icons/bs';
import { ConnectionHandler, useMutation } from 'react-relay';
import { ROOT_ID } from 'relay-runtime';
import * as yup from 'yup';

import {
  InputArea,
  InputField,
  Button,
  InputMaps,
  InputDate,
  InputAge,
  InputPrice,
  Hero,
  TextFormLabel,
  TextDecorated,
  InputSwitch,
  InputImage,
} from '@event-list/ui';

import { ShareEvent } from './mutations/ShareEventMutation';
import { ShareEventPreview } from './ShareEventPreview';
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
  private: yup.boolean().notRequired(),
});

const googleMapsApiToken = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function ShareEventForm() {
  const { t } = useTranslation(['ptBR', 'en']);

  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [EventShareEvent, isPending] = useMutation<ShareEventMutation>(ShareEvent);

  const onSubmit = (values: ShareEventParams) => {
    const connectionId = ConnectionHandler.getConnectionID(ROOT_ID, 'Events_myEvents');

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
          private: values.private,
        },
        connections: [connectionId],
      },
      onCompleted: ({ CreateEventMutation }: ShareEventMutation$data) => {
        if (typeof CreateEventMutation === 'undefined') {
          toast({
            title: t('Something was wrong'),
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
          title: '',
          value: '',
          visible: true,
        },
      ],
      flyer: '',
      private: false,
    },
    validationSchema: ShareEventSchema,
    onSubmit,
  });

  const { handleSubmit, isValid, dirty, values, setFieldValue } = formik;

  const isDisabled = !isValid || isPending || !dirty;

  useEffect(() => {
    const batchesLength = values.batches.length;
    setFieldValue(`batches.${batchesLength - 1}.date`, values.dateEnd);
    setFieldValue(`batches.${batchesLength - 1}.visible`, true);
  }, [values.dateEnd, values.batches.length]);

  return (
    <FormikProvider value={formik}>
      <Hero
        title={t('Share an event')}
        description={t(
          'Fill in all the fields and share your event in the best way. Only a few fields can be edited later, check all data before sharing, such as date, price and batches.',
        )}
      >
        <Box as={'form'} rounded={'lg'} border={'1px'} borderColor={'gray.700'} p={10} boxShadow={'2xl'}>
          <Stack spacing={6}>
            <HStack spacing={8}>
              <Box w="full">
                <InputField name="title" label={t('Title')} placeholder={t('Event name')} />
              </Box>
              <Box w="full">
                <InputMaps name="place" apiKey={googleMapsApiToken} label={t('Place')} placeholder={t('Event place')} />
              </Box>
              <Box>
                <InputSwitch
                  isRequired={false}
                  colorScheme={'red'}
                  name={'private'}
                  label={t('Private')}
                  labelProps={{
                    tooltip: t('Defines whether your event will appear in the catalog'),
                  }}
                />
              </Box>
            </HStack>
            <InputArea
              name="description"
              label={t('Description')}
              placeholder={t('Describe your event, the attractions, the place...')}
            />
            <Grid templateColumns={'2fr 2fr 2fr 2fr'} gap={8}>
              <Box w="full">
                <InputDate label={t('Date start')} name="dateStart" />
              </Box>
              <Box w="full">
                <InputDate label={t('Date end')} name="dateEnd" />
              </Box>
              <Box w="full">
                <InputDate name="listAvailableAt" label={t('List available at')} />
              </Box>
              <Box w="full">
                <InputAge name="classification" label={t('Classification')} />
              </Box>
            </Grid>
            <Grid templateColumns={'1fr 3fr'} gap={8}>
              <InputImage
                formControlProps={{
                  flex: 1,
                }}
                name="flyer"
                label={t('Flyer')}
                description={values.flyer ? t('Upload a new flyer') : t('Upload a flyer')}
                uploadedDescription={t('See your uploaded flyer below')}
              />
              <Box flex="2">
                <FieldArray
                  name="batches"
                  render={(arrayHelpers) => (
                    <Stack w={'full'} spacing={8}>
                      <FormControl id={'batches'} isRequired>
                        <TextFormLabel mt={'2'} label={t('Batches')} />
                        {values.batches.map((batch, index) => (
                          <Grid templateColumns={'2fr 2fr 1fr 0.8fr 1fr'} gap={4} key={index} mb="1rem">
                            <InputField
                              name={`batches.${index}.title`}
                              labelProps={{
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              label={t('Batch title')}
                              placeholder={t('First batch')}
                            />
                            <InputDate
                              name={`batches.${index}.date`}
                              labelProps={{
                                tooltip:
                                  index === values.batches.length - 1
                                    ? t('Last batch date is defined by event end date')
                                    : t('Define batch date available'),
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              label={t('Batch date')}
                              color={index === values.batches.length - 1 ? 'gray.600' : 'white'}
                              readOnly={index === values.batches.length - 1}
                            />
                            <InputPrice
                              name={`batches.${index}.value`}
                              labelProps={{
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              label={t('Batch price')}
                            />
                            <InputSwitch
                              colorScheme={'red'}
                              labelProps={{
                                fontSize: '13px',
                                fontWeight: 'medium',
                              }}
                              isReadOnly={index === values.batches.length - 1}
                              name={`batches.${index}.visible`}
                              label={t('Batch visible')}
                            />
                            <Box>
                              <TextFormLabel fontSize={'13px'} fontWeight={'medium'} label={t('Actions')} />
                              <Flex gap={1}>
                                <Button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                  isDisabled={values.batches.length <= 1}
                                  text={<BsFillTrashFill />}
                                  isSubmitting={false}
                                />
                                <Button
                                  type="button"
                                  isDisabled={values.batches.length > 5}
                                  onClick={() =>
                                    arrayHelpers.insert(index + 1, {
                                      date: '',
                                      title: '',
                                      value: '',
                                    })
                                  }
                                  text={<BsPlusCircleFill />}
                                  isSubmitting={false}
                                />
                              </Flex>
                            </Box>
                          </Grid>
                        ))}
                      </FormControl>
                    </Stack>
                  )}
                />
              </Box>
            </Grid>
            <Stack spacing={10} pt={2}>
              <Button
                mt={8}
                size="lg"
                onClick={() => router.push('#share-event-preview')}
                text={
                  <Flex alignItems={'center'}>
                    {t('Continue')} <AiOutlineArrowDown />
                  </Flex>
                }
                isSubmitting={false}
              />
            </Stack>
          </Stack>
        </Box>
        <Stack spacing={4}>
          <TextDecorated fontSize={'3xl'} fontWeight={'bold'}>
            {t('Preview')}
          </TextDecorated>
          <Text color={'gray.200'}>
            {t(
              'Confirm all event data, your event will look like this when shared and some information cannot be changed',
            )}
          </Text>
          <Box
            rounded={'lg'}
            border={'1px'}
            borderColor={'gray.700'}
            p={10}
            boxShadow={'2xl'}
            id={'share-event-preview'}
          >
            <ShareEventPreview
              title={values.title}
              listAvailableAt={values.listAvailableAt}
              description={values.description}
              place={values.place}
              price={values.batches[0].value}
              dateStart={values.dateStart}
              dateEnd={values.dateEnd}
              classification={values.classification}
              flyer={values.flyer}
            />
            <Stack spacing={10} pt={2}>
              <Button
                mt={8}
                loadingText="Submitting"
                size="lg"
                onClick={onOpen}
                isDisabled={isDisabled}
                text={t('Share event')}
                isSubmitting={isPending}
              />
              <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      {t('Share event')}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      {t('Are you sure about all the data you filled in? some data cannot be changed')}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button onClick={onClose} isSubmitting={false} text={'Cancel'} />
                      <Button
                        onClick={() => handleSubmit()}
                        ml={3}
                        loadingText={t('Submitting')}
                        isSubmitting={isPending}
                        isDisabled={isDisabled}
                        text={t('Share event')}
                      />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Stack>
          </Box>
        </Stack>
      </Hero>
    </FormikProvider>
  );
}
