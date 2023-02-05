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
    Input: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: 'Sifonn',
        fontSize: { base: 'sm', md: 'md' },
      },
    },
    Th: {
      baseStyle: {
        fontFamily: 'Sifonn',
      },
    },
  },
  initialColorMode: 'dark',
});

export default theme;
