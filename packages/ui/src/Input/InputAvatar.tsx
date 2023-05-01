import { Avatar, CircularProgress, Box, FormControl } from '@chakra-ui/react';
import type { AvatarProps } from '@chakra-ui/react';
import { useField } from 'formik';
import { useS3Upload } from 'next-s3-upload';
import { useState } from 'react';

import InputFile from './InputFile';

type InputAvatarProps = {
  label?: string;
  isRequired?: boolean;
} & AvatarProps;

const InputAvatar = (props: InputAvatarProps) => {
  const { name = '', label = '', icon, isRequired = true, ...rest } = props;
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
      <InputFile
        labelProps={{ color: 'gray.700' }}
        color={'gray.700'}
        id={`${label}-input`}
        name={name}
        label={label}
        display={'none'}
        onChange={handleFileChange}
      />
      <Avatar
        size={'xl'}
        icon={isLoadingImage ? <CircularProgress isIndeterminate color={'#E53E3E'} /> : icon}
        src={field.value}
        color={'gray.700'}
        bgColor={'transparent'}
        border="4px solid"
        borderColor="gray.800"
        cursor={'pointer'}
        onClick={() => document.getElementById(`${label}-input`)?.click()}
        {...rest}
      />
    </FormControl>
  );
};

export default InputAvatar;
