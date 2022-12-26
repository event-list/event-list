import { Container } from '@chakra-ui/react'
import SignInView from '../../components/sign-in/SignInView'
import Layout from '@event-list/ui/src/layout/Layout'
import getToken from '../../auth/getToken'

export default function SignIn() {
  return (
    <Layout title="Sign In">
      <Container maxW="full" mt={0} overflow="hidden">
        <SignInView />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const token = getToken({ req: ctx.req, res: ctx.res })

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      },
      props: {}
    }
  }

  return {
    props: {}
  }
}
