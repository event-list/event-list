'use client';

import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons';
import {
  FiChevronDown,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiMenu,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';
import { Logo } from '@event-list/assets';

type LinkItemProps = {
  name: string;
  icon: IconType;
  href: string;
};

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, href: '/' },
  { name: 'Share your Event', icon: FiTrendingUp, href: '/share-your-event' },
];

type Props = { children: React.ReactNode, user: any, onLogout: () => void };

export default function Header(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent={{ base: 'space-between', md: 'flex-end' }}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Logo
        </Text>

        <HStack spacing={{ base: '0', md: '6' }}>
          {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
          <Flex alignItems={'center'}>
            {props.user?.name ? (
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: 'none' }}
                >
                  <HStack>
                    <FiUser />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="base">{props.user?.name}</Text>
                    </VStack>
                    <Box display={{ base: 'none', md: 'flex' }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList zIndex={10} bg="gray.900" borderColor="gray.700">
                  {/* <MenuItem>Profile</MenuItem> */}
                  {/* <MenuDivider /> */}
                  <MenuItem
                    onClick={props.onLogout}
                    icon={<Icon w={5} h={6} as={FiLogOut} />}
                  >
                    Sign out
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
                  Sign In
                </Button>
              </>
            )}
          </Flex>
        </HStack>
      </Flex>
      <Box ml={{ base: 0, md: 60 }} p="4" minH={'100vh'} >
        {props.children}
      </Box>
    </Box>
  );
}

type SidebarProps = BoxProps & { onClose: () => void };

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <>
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Logo />
          <CloseButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} href={link.href}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    </>
  );
};

type NavItemProps = FlexProps & {
  href: string;
  icon: IconType;
  children: ReactText;
};

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bgGradient: 'linear(to-r, red.500,pink.500)',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
