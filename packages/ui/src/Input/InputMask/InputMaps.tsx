import type { FormLabelProps, InputProps } from '@chakra-ui/react';
import { useField } from 'formik';
import AutoComplete from 'react-google-autocomplete';
import type { ReactGoogleAutocompleteProps } from 'react-google-autocomplete';

import InputField from '../InputField';

type InputMapsProps = {
  label?: string;
  labelProps?: FormLabelProps & { decorated?: boolean };
} & InputProps &
  ReactGoogleAutocompleteProps;

const InputMaps = (props: InputMapsProps) => {
  const { labelProps, name = '', ...restProps } = props;

  const [_, __, helpers] = useField(name);

  return (
    <InputField
      as={AutoComplete}
      options={{
        types: ['bar', 'night_club', 'park'],
        componentRestrictions: { country: 'br' },
      }}
      onPlaceSelected={(place) => helpers.setValue(place.name)}
      {...restProps}
      name={name}
      labelProps={labelProps}
    />
  );
};

export default InputMaps;
