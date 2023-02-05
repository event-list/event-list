import { graphql } from 'react-relay';

export const SignIn = graphql`
  mutation SignInMutation($input: MerchantSignInMutationInput!) {
    MerchantSignInMutation(input: $input) {
      success
      error
    }
  }
`;
