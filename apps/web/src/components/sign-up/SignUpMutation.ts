import { graphql } from 'relay-runtime'

export const SignUp = graphql`
  mutation SignUpMutation($input: UserSignUpMutationInput!) {
    UserSignUpMutation(input: $input) {
      success
      error {
        field
        message
      }
    }
  }
`
