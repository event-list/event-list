import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
    Link: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
    ListItem: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
    List: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
    StatNumber: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
  },
  initialColorMode: 'dark',
  useSystemColorMode: false,
});

export default theme;
