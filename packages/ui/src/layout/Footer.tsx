import { Box, Container, Button, Stack, Text, useColorModeValue, VisuallyHidden, Link } from '@chakra-ui/react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';

//@ts-expect-error it not have type
import Logo from '../logo.svg';

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
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
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      role="contentinfo"
      ml={{ base: 0, md: 60 }}
      borderTop="1px"
      py="10"
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
        <Stack align={'flex-start'}>
          <ListHeader>Company</ListHeader>
          <Link href={'#'}>About us</Link>
          <Link href={'#'}>Blog</Link>
          <Link href={'#'}>Contact us</Link>
          <Link href={'#'}>Pricing</Link>
          <Link href={'#'}>Testimonials</Link>
        </Stack>
        <Stack align={'flex-start'}>
          <ListHeader>Support</ListHeader>
          <Link href={'#'}>Help Center</Link>
          <Link href={'#'}>Terms of Service</Link>
          <Link href={'#'}>Legal</Link>
          <Link href={'#'}>Privacy Policy</Link>
          <Link href={'#'}>Satus</Link>
        </Stack>
        <Stack spacing={6}>
          <Box w="40">
            <Image src={Logo} />
          </Box>
          <Text fontSize={'sm'}>© {new Date().getFullYear()} Event List. All rights reserved</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'#'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'YouTube'} href={'#'}>
              <FaGithub />
            </SocialButton>
            <SocialButton label={'Instagram'} href={'#'}>
              <FaInstagram />
            </SocialButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
