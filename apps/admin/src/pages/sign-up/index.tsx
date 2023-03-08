import { Container } from '@chakra-ui/react';

import { Layout } from '@event-list/ui';

import getToken from '../../auth/getToken';
import SignUpView from '../../components/sign-up/SignUpView';

export default function SignUp() {
  return (
    <Layout title="Sign Up">
      <Container maxW="full" mt={0} overflow="hidden">
        <SignUpView />
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  // const token = getToken({ req: ctx.req, res: ctx.res });
  //
  // if (token) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/',
  //     },
  //     props: {},
  //   };
  // }

  return {
    props: {},
  };
}
