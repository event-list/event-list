import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    Link: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    ListItem: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    List: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    StatNumber: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    Input: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: 'Noto Sans',
        fontSize: { base: 'sm', md: 'md' },
      },
    },
    Th: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'Noto Sans',
      },
    },
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

export default theme;
