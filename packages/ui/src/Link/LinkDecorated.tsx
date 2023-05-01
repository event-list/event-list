import { Link } from '@chakra-ui/react';
import type { LinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';

export type LinkDecoratedProps = {
  href: string;
  label: string | JSX.Element;
} & LinkProps;

const LinkDecorated = (props: LinkDecoratedProps) => {
  const { href, label, target, ...restProps } = props;
  return (
    <NextLink href={href} target={target}>
      <Link
        href={href}
        textAlign={'center'}
        borderRadius={'md'}
        px={4}
        py={2}
        fontWeight={600}
        bgGradient="linear(to-r, red.500,pink.600)"
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, red.600,pink.700)',
          boxShadow: 'xl',
          transitionDuration: '2ms',
          textDecoration: 'none',
        }}
        {...restProps}
      >
        {label}
      </Link>
    </NextLink>
  );
};

export default LinkDecorated;
