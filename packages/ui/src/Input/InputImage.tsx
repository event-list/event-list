import { Flex, CircularProgress, Text, FormControl } from '@chakra-ui/react';
import type { AvatarProps } from '@chakra-ui/react';
import { useField } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useState } from 'react';
import { RiFolderUploadFill } from 'react-icons/ri';

import InputFile from './InputFile';

type InputImageProps = {
  label?: string;
  isRequired?: boolean;
  description?: string;
  uploadedDescription?: string;
} & AvatarProps;

const InputImage = (props: InputImageProps) => {
  const { name = '', label = '', icon, isRequired = true, description, uploadedDescription, ...rest } = props;

  const [field, __, { setValue }] = useField(name);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const { uploadToS3 } = useS3Upload();

  const handleFileChange = async (event) => {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      alert('File is too big! 1MB Max');
    }
    setIsLoadingImage(true);
    const { url } = await uploadToS3(file);
    setIsLoadingImage(false);

    setValue(url);
  };

  return (
    <FormControl id={name} isRequired={isRequired}>
      <InputFile id={`${label}-input`} name={name} label={label} display={'none'} onChange={handleFileChange} />
      <Flex
        height={'full'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        gap={2}
        cursor={'pointer'}
        mt={6}
        onClick={() => document.getElementById(`${label}-input`)?.click()}
        {...rest}
      >
        {isLoadingImage ? (
          <CircularProgress isIndeterminate color={'#E53E3E'} />
        ) : (
          <RiFolderUploadFill size={'2.5rem'} />
        )}
        <Text fontSize={'lg'} fontWeight={'bold'}>
          {description}
        </Text>
        {field.value && <Text fontSize={'sm'}>{uploadedDescription}</Text>}
      </Flex>
    </FormControl>
  );
};

export default InputImage;
