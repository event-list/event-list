import { graphql } from 'react-relay';

export const SignIn = graphql`
  mutation SignInMutation($input: UserSignInMutationInput!) {
    UserSignInMutation(input: $input) {
      success
      error
    }
  }
`;
