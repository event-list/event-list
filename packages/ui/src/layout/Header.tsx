import type { BoxProps } from '@chakra-ui/react';
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Button as ButtonChakra,
} from '@chakra-ui/react';
import { FiChevronDown, FiLogIn, FiLogOut, FiMenu } from 'react-icons/fi';

import Logo from '../logo.svg';

type Props = {
  children: React.ReactNode;
  user: { name: string } | null;
  onLogout: () => void;
  links: JSX.Element;
  subMenuItems: JSX.Element;
  searchBar?: JSX.Element;
};

export default function Header(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} links={props.links} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} links={props.links} />
        </DrawerContent>
      </Drawer>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={'gray.900'}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between' }}
      >
        <HStack>
          <ButtonChakra display={{ base: 'flex', md: 'none' }} p={1} mx={1} bgColor={'transparent'} onClick={onOpen}>
            <FiMenu />
          </ButtonChakra>
          {props.searchBar}
        </HStack>

        <HStack spacing={{ base: '0', md: '6' }}>
          {/* <IconButton size="lg" variant="ghost" aria-merchant="open menu" icon={<FiBell />} /> */}
          <Flex alignItems={'center'}>
            {props.user?.name ? (
              <Menu>
                <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                  <HStack>
                    <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                      <Text fontSize="base">{props.user?.name}</Text>
                    </VStack>
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <Icon as={FiChevronDown} />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  zIndex={10}
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  bgColor={useColorModeValue('gray.50', 'gray.900')}
                  borderColor="gray.700"
                >
                  {/* <MenuItem>Profile</MenuItem> */}
                  {/* <MenuDivider /> */}
                  {props.subMenuItems}
                  <MenuItem onClick={props.onLogout} icon={<Icon w={5} h={6} as={FiLogOut} />}>
                    <Text fontSize={13}>Sign out</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button
                  as={'a'}
                  fontSize={'base'}
                  fontWeight={400}
                  variant={'link'}
                  href={'/sign-in'}
                  rightIcon={<FiLogIn />}
                >
                  <Text>Sign In</Text>
                </Button>
              </>
            )}
          </Flex>
        </HStack>
      </Flex>
      <Box ml={{ base: 0, md: 60 }} p="6" minH={'100vh'}>
        {props.children}
      </Box>
    </Box>
  );
}

type SidebarProps = BoxProps & { onClose: () => void; links: Props['links'] };

const SidebarContent = ({ onClose, links, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('gray.50', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="100%"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {links}
    </Box>
  );
};
