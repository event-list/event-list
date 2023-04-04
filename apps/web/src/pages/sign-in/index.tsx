import { Box } from '@chakra-ui/react';

import Layout from '@event-list/ui/src/layout/Layout';

import getToken from '../../auth/getToken';
import SignInView from '../../components/sign-in/SignInView';

export default function SignIn() {
  return (
    <Layout title="Sign In">
      <Box maxW="full" mt={0} overflow="hidden">
        <SignInView />
      </Box>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const token = getToken({ req: ctx.req, res: ctx.res });

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}
