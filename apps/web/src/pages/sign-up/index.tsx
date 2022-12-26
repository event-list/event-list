import { Container } from '@chakra-ui/react'
import SignUpView from '../../components/sign-up/SignUpView'
import getToken from '../../auth/getToken'
import { Layout } from '@event-list/ui'

export default function SignUp() {
  return (
    <Layout title="Sign Up">
      <Container maxW="full" mt={0} overflow="hidden">
        <SignUpView />
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
