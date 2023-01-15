import {
  Box,
  Container,
  Button,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';

//@ts-expect-error it not have type
import Logo from '../logo.svg';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </>
    </Button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      role="contentinfo"
      position="absolute"
      bottom={'0'}
      left={'0'}
      right={'0'}
      borderTop="1px"
      borderTopColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Box h="10">
          <Image src={Logo} alt={'Small and purple Event List logo'} />
        </Box>
        <Text>© 2022 Event List. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'GitHub'} href={'https://github.com/event-list'}>
            <FaGithub />
          </SocialButton>
          <SocialButton
            label={'Instagram'}
            href={'https://www.instagram.com/eventlist.ev/'}
          >
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
