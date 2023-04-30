import { Box } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Layout from '@event-list/ui/src/layout/Layout';

import getToken from '../../auth/getToken';
import SignInView from '../../components/sign-in/SignInView';

export default function SignIn() {
  const { t } = useTranslation(['en', 'ptBR']);

  return (
    <Layout title={t('Sign In')!}>
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
    props: {
      ...(await serverSideTranslations(ctx.locale, ['en', 'ptBR'])),
    },
  };
}
